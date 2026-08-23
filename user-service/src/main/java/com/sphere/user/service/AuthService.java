package com.sphere.user.service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sphere.user.dto.request.ForgetPasswordRequest;
import com.sphere.user.dto.request.LoginRequest;
import com.sphere.user.dto.request.RegisterRequest;
import com.sphere.user.dto.request.ResetPasswordRequest;
import com.sphere.user.dto.request.VerifyOtpRequest;
import com.sphere.user.dto.response.AuthResponse;
import com.sphere.user.dto.response.UsernameAvailabilityResponse;
import com.sphere.user.entity.User;
import com.sphere.user.exception.BadRequestException;
import com.sphere.user.exception.ConflictException;
import com.sphere.user.exception.NotFoundException;
import com.sphere.user.exception.TooManyRequestsException;
import com.sphere.user.mapper.UserMapper;
import com.sphere.user.repository.UserRepository;
import com.sphere.user.security.JwtService;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/controllers/auth.controller.js and the auth-relevant
 * parts of services/{auth,user}.services.js. Only the EMAIL verification /
 * EMAIL password-reset paths are implemented — phone/Twilio paths are
 * excluded (docs/exclusions/TWILIO_EXCLUDED.md).
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Set<String> RESERVED_USERNAMES = Set.of("shravan", "admin", "test");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;

    @Value("${sphere.client-url}")
    private String clientUrl;

    // ---------------------------------------------------------------
    // Register
    // ---------------------------------------------------------------

    @Transactional
    public String register(RegisterRequest request) {
        String username = request.name() == null ? null : request.name().trim();
        String email = blankToNull(request.email());

        if (email == null) {
            throw new BadRequestException("Email is required for verification.");
        }

        checkExistingVerifiedUser(username, email);

        User unverified = userRepository.findUnverifiedByEmail(email).orElse(null);

        String verificationCode;
        if (unverified != null) {
            verificationCode = handleUnverifiedUser(unverified);
        } else {
            User user = User.builder()
                    .username(username)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(request.password()))
                    .accountVerified(false)
                    .attempts(0)
                    .build();
            verificationCode = generateFiveDigitCode();
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
            userRepository.save(user);
        }

        String html = emailTemplateService.verificationCodeTemplate(verificationCode);
        emailService.sendEmail(email, "Your Verification Code", html);
        return "Verification code successfully sent to " + email;
    }

    private void checkExistingVerifiedUser(String username, String email) {
        if (username != null && userRepository.existsByUsernameAndAccountVerifiedTrue(username)) {
            throw new ConflictException("Username already exists.");
        }
        if (email != null && userRepository.existsByEmailAndAccountVerifiedTrue(email)) {
            throw new ConflictException("Email address already registered.");
        }
    }

    /** Ports services/user.services.js#handleUnverifiedUser. */
    private String handleUnverifiedUser(User user) {
        if (user.getAttempts() >= 3) {
            Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
            if (user.getLastAttemptAt() != null && user.getLastAttemptAt().isAfter(oneHourAgo)) {
                throw new TooManyRequestsException("Too many attempts. Try again after 1 hour.");
            }
            user.setAttempts(0);
            user.setLastAttemptAt(null);
        }
        String verificationCode = generateFiveDigitCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
        user.setAttempts(user.getAttempts() + 1);
        user.setLastAttemptAt(Instant.now());
        userRepository.save(user);
        return verificationCode;
    }

    // ---------------------------------------------------------------
    // Verify OTP
    // ---------------------------------------------------------------

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = blankToNull(request.email());
        User user = userRepository.findUnverifiedByEmail(email)
                .orElseThrow(() -> new NotFoundException("No user found to be verified."));

        if (!request.otp().equals(user.getVerificationCode())) {
            throw new BadRequestException("Invalid OTP");
        }
        if (user.getVerificationCodeExpiresAt() == null || user.getVerificationCodeExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("OTP Expired. Please request a new one.");
        }

        user.setAccountVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user.setAttempts(0);
        user.setLastAttemptAt(null);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    // ---------------------------------------------------------------
    // Login
    // ---------------------------------------------------------------

    public AuthResponse login(LoginRequest request) {
        String email = blankToNull(request.email());

        User user = userRepository.findByEmailAndAccountVerifiedTrue(email)
                .orElseThrow(() -> new NotFoundException("No user found with " + email));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Incorrect credentials");
        }

        return buildAuthResponse(user);
    }

    // ---------------------------------------------------------------
    // Logout
    // ---------------------------------------------------------------

    public void logout(String rawToken) {
        // Token blacklist storage removed per configuration.
    }

    // ---------------------------------------------------------------
    // Forget / reset password (email flow only)
    // ---------------------------------------------------------------

    @Transactional
    public String forgetPassword(ForgetPasswordRequest request) {
        String email = blankToNull(request.email());
        if (email == null) {
            // Phone path excluded — see docs/exclusions/TWILIO_EXCLUDED.md
            throw new BadRequestException("Email is required for password reset.");
        }

        User user = userRepository.findByEmailAndAccountVerifiedTrue(email)
                .orElseThrow(() -> new NotFoundException("No user is registered with " + email));

        String rawToken = generateResetToken();
        user.setResetPasswordTokenHash(sha256Hex(rawToken));
        user.setResetPasswordTokenExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
        userRepository.save(user);

        String resetUrl = clientUrl + "/reset-password/email/" + rawToken;
        String html = emailTemplateService.resetPasswordTemplate(resetUrl);
        emailService.sendEmail(email, "Your Reset Password Link", html);

        return "Reset password link is sent to " + email;
    }

    @Transactional
    public void resetPasswordWithEmailToken(String token, ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        String tokenHash = sha256Hex(token);
        User user = userRepository
                .findByResetPasswordTokenHashAndAccountVerifiedTrueAndResetPasswordTokenExpiresAtAfter(tokenHash, Instant.now())
                .orElseThrow(() -> new BadRequestException("Invalid or expired token"));

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Previously used password. Use a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setResetPasswordTokenHash(null);
        user.setResetPasswordTokenExpiresAt(null);
        userRepository.save(user);
    }

    // ---------------------------------------------------------------
    // Username availability
    // ---------------------------------------------------------------

    public UsernameAvailabilityResponse checkUsernameAvailability(String username) {
        if (username == null || username.trim().length() < 3 || username.trim().length() > 20) {
            return new UsernameAvailabilityResponse(false, "username should be between 3 and 20 characters.");
        }
        String trimmed = username.trim();
        for (char c : trimmed.toCharArray()) {
            if (Character.isUpperCase(c)) {
                return new UsernameAvailabilityResponse(false, "username cannot contain uppercase letter " + c);
            }
            if (c == ' ') {
                return new UsernameAvailabilityResponse(false, "username cannot contain space");
            }
            if (!(Character.isLowerCase(c) || Character.isDigit(c) || c == '.' || c == '_')) {
                return new UsernameAvailabilityResponse(false, "username cannot contain " + c);
            }
        }
        if (RESERVED_USERNAMES.contains(trimmed)) {
            return new UsernameAvailabilityResponse(false, "username is reserved");
        }
        if (userRepository.existsByUsernameAndAccountVerifiedTrue(trimmed)) {
            return new UsernameAvailabilityResponse(false, "username already taken");
        }
        return new UsernameAvailabilityResponse(true, "username is available");
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token, userMapper.toUserResponse(user));
    }

    public User requireById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("No user exists"));
    }

    private String generateFiveDigitCode() {
        return String.valueOf(10000 + RANDOM.nextInt(90000));
    }

    private String generateResetToken() {
        byte[] bytes = new byte[20];
        RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}

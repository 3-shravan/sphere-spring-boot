package com.sphere.user.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sphere.user.dto.request.ForgetPasswordRequest;
import com.sphere.user.dto.request.LoginRequest;
import com.sphere.user.dto.request.RegisterRequest;
import com.sphere.user.dto.request.ResetPasswordRequest;
import com.sphere.user.dto.request.VerifyOtpRequest;
import com.sphere.user.dto.response.AuthResponse;
import com.sphere.user.dto.response.UsernameAvailabilityResponse;
import com.sphere.user.entity.User;
import com.sphere.user.mapper.UserMapper;
import com.sphere.user.security.JwtAuthenticationFilter;
import com.sphere.user.service.AuthService;
import com.sphere.user.util.ResponseUtil;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/routes/auth.routes.js.
 * Base path /api/v1/auth is set at the class level to mirror app.ts's
 * app.use("/api/v1/auth", authRouter).
 */
@RestController
@org.springframework.web.bind.annotation.RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Registration, email verification, login, logout, password reset")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @GetMapping("/check-username")
    public UsernameAvailabilityResponse checkUsername(@RequestParam String username) {
        // Non-standard envelope preserved exactly — see docs/api/API_INVENTORY.md
        return authService.checkUsernameAvailability(username);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.ok(ResponseUtil.success(message));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse auth = authService.verifyOtp(request);
        return ResponseEntity.ok(ResponseUtil.success("Account Successfully Verified", Map.of(
                "token", auth.token(), "user", auth.user())));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse auth = authService.login(request);
        return ResponseEntity.ok(ResponseUtil.success("Login Successfull \uD83D\uDE80", Map.of(
                "token", auth.token(), "user", auth.user())));
    }

    @GetMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> logout(@RequestAttribute(required = false) String currentToken) {
        if (currentToken == null) {
            throw JwtAuthenticationFilter.missingTokenException();
        }
        authService.logout(currentToken);
        return ResponseEntity.ok(ResponseUtil.success("logged out \uD83D\uDE22"));
    }

    @GetMapping("/profile")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> getUser(@AuthenticationPrincipal User currentUser) {
        // Ports auth.controller.js#getUser's hand-rolled { success, user } shape (no "message" key).
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("success", true);
        body.put("user", userMapper.toUserResponse(currentUser));
        return ResponseEntity.ok(body);
    }

    @PostMapping("/forget-password")
    public ResponseEntity<Map<String, Object>> forgetPassword(@RequestBody ForgetPasswordRequest request) {
        String message = authService.forgetPassword(request);
        return ResponseEntity.ok(ResponseUtil.success(message));
    }

    @PutMapping("/reset-password/email/{token}")
    public ResponseEntity<Map<String, Object>> resetPasswordWithEmailToken(
            @PathVariable String token, @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPasswordWithEmailToken(token, request);
        return ResponseEntity.ok(ResponseUtil.success("Password reset successfully"));
    }

    // NOTE: /forget-password/verify-otp and /reset-password/phone/:phone are
    // intentionally NOT implemented — phone/Twilio flow is excluded.
    // See docs/exclusions/TWILIO_EXCLUDED.md. Requests to these paths will
    // 404 at this service (no route exists) rather than being silently
    // stubbed with a fake success response.
}

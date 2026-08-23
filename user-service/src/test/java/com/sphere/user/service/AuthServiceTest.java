package com.sphere.user.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sphere.user.dto.request.LoginRequest;
import com.sphere.user.dto.request.RegisterRequest;
import com.sphere.user.entity.User;
import com.sphere.user.exception.BadRequestException;
import com.sphere.user.exception.ConflictException;
import com.sphere.user.exception.NotFoundException;
import com.sphere.user.mapper.UserMapper;
import com.sphere.user.repository.UserRepository;
import com.sphere.user.security.JwtService;

/**
 * Representative unit coverage for AuthService's core parity behaviors
 * traced from the source (see docs/01-existing-system-analysis.md §4-6).
 * A full Testcontainers-backed integration suite (real Postgres, real
 * controller layer, real Flyway migrations) is a documented follow-up —
 * not included in this first pass so the service could be delivered for
 * review without blocking on it.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private UserMapper userMapper;
    @Mock private EmailService emailService;
    @Mock private EmailTemplateService emailTemplateService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        org.springframework.test.util.ReflectionTestUtils.setField(authService, "clientUrl", "http://localhost:5173");
    }

    @Test
    void register_rejectsDuplicateVerifiedEmail() {
        RegisterRequest request = new RegisterRequest("newuser", "taken@b.com", "password1");
        when(userRepository.existsByUsernameAndAccountVerifiedTrue("newuser")).thenReturn(false);
        when(userRepository.existsByEmailAndAccountVerifiedTrue("taken@b.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Email address already registered");
    }

    @Test
    void login_wrongPassword_throwsBadRequest_matchingSourceMessage() {
        User user = User.builder().id(1L).email("a@b.com").passwordHash("hashed").accountVerified(true).build();
        when(userRepository.findByEmailAndAccountVerifiedTrue("a@b.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        LoginRequest request = new LoginRequest("a@b.com", "wrong");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Incorrect credentials");
    }

    @Test
    void login_noSuchVerifiedUser_throwsNotFound() {
        when(userRepository.findByEmailAndAccountVerifiedTrue("nobody@b.com")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("nobody@b.com", "whatever1");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(NotFoundException.class);
    }
}

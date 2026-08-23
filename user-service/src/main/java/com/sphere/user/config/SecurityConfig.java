package com.sphere.user.config;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sphere.user.dto.response.ErrorResponse;
import com.sphere.user.exception.ErrorType;
import com.sphere.user.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * Route-level auth requirements below mirror server/src/routes/{auth,user}.routes.js
 * exactly (see docs/api/API_INVENTORY.md "Auth" column per endpoint).
 *
 * Password hashing: BCryptPasswordEncoder, strength 10 — matches
 * bcrypt.hash(password, 10) in user.model.js's pre("save") hook.
 *
 * CORS is normally the gateway's job (docs/02-target-architecture.md), but a
 * permissive same-origin-safe config is included here too since this
 * service may also be hit directly in local dev without the gateway.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ObjectMapper objectMapper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // stateless JWT API, no cookie-based session — CSRF not applicable (matches source, which has no CSRF middleware)
                .cors(cors -> cors.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ---- AUTH routes ----
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/check-username").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/verify-otp").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/logout").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/profile").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/forget-password").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/auth/reset-password/email/**").permitAll()

                        // ---- USER routes ----
                        .requestMatchers(HttpMethod.GET, "/api/v1/users").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/suggested").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/birthdays").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/profile").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/profile/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/update").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/*/follow").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/*/block").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/profile-picture").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/delete").authenticated()

                        // Internal, service-to-service only (post-service resolving author display data) — not part of the public gateway contract.
                        .requestMatchers("/internal/**").authenticated()

                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(this::handleUnauthenticated))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Ports authUser.js's `if (!token) throw new UNAUTHORIZED("login to get access.")`
    // for routes that require auth but received no token at all.
    private void handleUnauthenticated(jakarta.servlet.http.HttpServletRequest request,
                                        jakarta.servlet.http.HttpServletResponse response,
                                        org.springframework.security.core.AuthenticationException authException) throws IOException {
        response.setStatus(401);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(
                ErrorResponse.of(ErrorType.Unauthorized.name(), "login to get access.")));
    }
}

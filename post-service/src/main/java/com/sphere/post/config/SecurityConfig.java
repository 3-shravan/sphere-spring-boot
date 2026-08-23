package com.sphere.post.config;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.sphere.post.exception.ErrorType;
import com.sphere.post.security.JwtAuthenticationFilter;
import com.sphere.post.util.ErrorJsonWriter;

import lombok.RequiredArgsConstructor;

/**
 * Route-level auth requirements mirror server/src/routes/post.routes.js
 * exactly (see docs/api/API_INVENTORY.md). Two routes are intentionally
 * public, matching the source's grantUnknownAccess / no-middleware routes:
 * - GET /posts/{postId} (optional auth in source; here treated
 * as fully public since the isSaved-for-anonymous-viewer nuance is
 * handled in the controller by reading the SecurityContext if present,
 * not by requiring it)
 * - GET /posts/{postId}/comments (no authUser in source at all)
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable()) // Disabled because API Gateway handles CORS centrally
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/v1/posts/{postId:[0-9]+}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/posts/{postId:[0-9]+}/comments").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(this::handleUnauthenticated))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void handleUnauthenticated(jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response,
            org.springframework.security.core.AuthenticationException authException) throws IOException {
        response.setStatus(401);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(ErrorJsonWriter.write(ErrorType.Unauthorized.name(), "login to get access."));
    }
}

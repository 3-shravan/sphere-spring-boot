package com.sphere.user.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sphere.user.dto.response.ErrorResponse;
import com.sphere.user.entity.User;
import com.sphere.user.exception.ApiException;
import com.sphere.user.exception.ErrorType;
import com.sphere.user.exception.NotFoundException;
import com.sphere.user.exception.UnauthorizedException;
import com.sphere.user.repository.UserRepository;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // NOTE: exceptions thrown here run BEFORE the DispatcherServlet, so
    // @RestControllerAdvice (GlobalExceptionHandler) never sees them. We
    // catch and write the identical envelope directly here instead, to keep
    // exactly one error-shape definition conceptually (see writeError()).
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null) {
            try {
                Long userId = jwtService.parseUserId(token);

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new NotFoundException("No user exists"));

                var authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                request.setAttribute("currentToken", token);
            } catch (ExpiredJwtException e) {
                writeError(response, 401, ErrorType.TokenExpired, "Token expired, login again!");
                return;
            } catch (JwtException e) {
                writeError(response, 401, ErrorType.BadToken, "Token is invalid, try again!");
                return;
            } catch (ApiException e) {
                writeError(response, e.getStatus().value(), e.getType(), e.getMessage());
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void writeError(HttpServletResponse response, int status, ErrorType type, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(ErrorResponse.of(type.name(), message)));
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /** Used by endpoints that require auth (e.g. logout) when no token was found at all. */
    public static UnauthorizedException missingTokenException() {
        return new UnauthorizedException("login to get access.");
    }
}

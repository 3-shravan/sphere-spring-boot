package com.sphere.ai.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sphere.ai.exception.ApiException;
import com.sphere.ai.exception.ErrorType;
import com.sphere.ai.util.ErrorJsonWriter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Mirrors JwtAuthenticationFilter from post-service.
 * Extracts and verifies the JWT from the Authorization header or 'token'
 * cookie.
 * On success, sets the verified userId (Long) as the Spring Security principal.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String token = extractToken(request);

    if (token != null) {
      try {
        Long userId = jwtService.parseUserId(token);
        var authentication = new UsernamePasswordAuthenticationToken(userId, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
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
    response.getWriter().write(ErrorJsonWriter.write(type.name(), message));
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
}

package com.sphere.user.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sphere.user.dto.response.ErrorResponse;
import com.sphere.user.exception.ErrorType;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class InternalApiKeyFilter extends OncePerRequestFilter {

    private final String internalApiKey;
    private final ObjectMapper objectMapper;

    public InternalApiKeyFilter(@Value("${sphere.internal.api-key:}") String internalApiKey, ObjectMapper objectMapper) {
        this.internalApiKey = internalApiKey;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/internal/")) {
            String apiKey = request.getHeader("X-Internal-Api-Key");
            if (apiKey == null || !apiKey.equals(internalApiKey) || internalApiKey.isEmpty()) {
                response.setStatus(403);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write(objectMapper.writeValueAsString(
                        ErrorResponse.of(ErrorType.Unauthorized.name(), "Invalid Internal API Key")));
                return;
            }
            
            // Set a dummy authentication so Spring Security's .authenticated() allows it
            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken("internal-service", null, java.util.List.of())
            );
        }

        filterChain.doFilter(request, response);
    }
}

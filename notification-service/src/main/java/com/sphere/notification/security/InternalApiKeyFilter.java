package com.sphere.notification.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sphere.notification.util.ErrorJsonWriter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Guards POST /internal/notifications, the only HTTP endpoint this service
 * exposes — called exclusively by user-service/post-service's Feign
 * clients, authenticated with the same shared X-Internal-Api-Key convention
 * used by user-service's /internal/** API. This service is small enough
 * that pulling in the full Spring Security dependency just for one header
 * check felt like unnecessary weight — a plain servlet Filter does the job.
 */
@Component
@Order(1)
public class InternalApiKeyFilter extends OncePerRequestFilter {

    private static final String HEADER = "X-Internal-Api-Key";

    private final String expectedKey;

    public InternalApiKeyFilter(@Value("${sphere.internal.api-key}") String expectedKey) {
        this.expectedKey = expectedKey;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/internal/")) {
            String provided = request.getHeader(HEADER);
            if (provided == null || provided.isBlank() || !provided.equals(expectedKey)) {
                response.setStatus(401);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write(ErrorJsonWriter.write("Unauthorized", "Invalid or missing internal API key"));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}

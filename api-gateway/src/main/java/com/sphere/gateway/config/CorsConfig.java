package com.sphere.gateway.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

/**
 * CORS behavior ported from the Node source (server/src/config/cors.js):
 * an explicit origin whitelist (client URL + the two local dev origins),
 * credentials allowed, all standard methods/headers.
 *
 * The Node app additionally allowed *no-origin* requests (server-to-server,
 * curl, mobile apps) through unconditionally — same-origin/tooling requests
 * never send an Origin header, so Spring's CORS layer (which only applies to
 * requests that DO send Origin) already matches that behavior without extra code.
 */
@Configuration
public class CorsConfig {

    @Value("${sphere.cors.client-url}")
    private String clientUrl;

    @Value("${sphere.cors.production-client-url:}")
    private String productionClientUrl;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(allowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return new CorsWebFilter(source);
    }

    private List<String> allowedOrigins() {
        return List.of(
                clientUrl,
                productionClientUrl == null || productionClientUrl.isBlank()
                        ? "http://localhost:5173" // placeholder filtered below if duplicate
                        : productionClientUrl,
                "http://localhost:5173",
                "http://localhost:3000"
        ).stream().filter(origin -> origin != null && !origin.isBlank()).distinct().toList();
    }
}

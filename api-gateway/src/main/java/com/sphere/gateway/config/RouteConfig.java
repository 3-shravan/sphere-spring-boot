package com.sphere.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r
                        .path("/api/v1/auth/**", "/api/v1/users/**")
                        .uri("lb://user-service"))
                .route("post-service", r -> r
                        .path("/api/v1/posts/**", "/api/v1/likes/**")
                        .uri("lb://post-service"))
                .route("notification-service", r -> r
                        .path("/api/v1/notifications/**")
                        .uri("lb://notification-service"))
                .route("ai-service", r -> r
                        .path("/api/v1/ai/**")
                        .uri("lb://ai-service"))
                .build();
    }
}

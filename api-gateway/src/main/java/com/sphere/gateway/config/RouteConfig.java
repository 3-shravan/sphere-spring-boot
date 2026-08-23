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
                .route("user-service-auth", r -> r.path("/api/v1/auth/**")
                        .uri("lb://USER-SERVICE"))
                .route("user-service-users", r -> r.path("/api/v1/users/**")
                        .uri("lb://USER-SERVICE"))
                .route("post-service-posts", r -> r.path("/api/v1/posts/**")
                        .uri("lb://POST-SERVICE"))
                .route("user-service-docs", r -> r.path("/user-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/user-service/v3/api-docs", "/v3/api-docs"))
                        .uri("lb://USER-SERVICE"))
                .route("post-service-docs", r -> r.path("/post-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/post-service/v3/api-docs", "/v3/api-docs"))
                        .uri("lb://POST-SERVICE"))
                .route("notification-service-docs", r -> r.path("/notification-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/notification-service/v3/api-docs", "/v3/api-docs"))
                        .uri("lb://NOTIFICATION-SERVICE"))
                .build();
    }
}

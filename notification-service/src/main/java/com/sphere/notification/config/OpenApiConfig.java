package com.sphere.notification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI notificationServiceOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Sphere Notification Service")
                .description("Real-time (non-persisted) delivery of follow/like/comment/reply notifications over STOMP/WebSocket. "
                        + "The one HTTP endpoint here (/internal/notifications) is service-to-service only — see README for the /ws client contract.")
                .version("1.0.0"));
    }
}

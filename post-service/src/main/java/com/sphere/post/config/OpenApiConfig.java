package com.sphere.post.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI postServiceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sphere Post Service")
                        .description("Posts, feed, likes, saved posts, and threaded comments")
                        .version("1.0.0"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new io.swagger.v3.oas.models.security.SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}

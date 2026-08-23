package com.sphere.post.config;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary(
            @Value("${sphere.cloudinary.cloud-name}") String cloudName,
            @Value("${sphere.cloudinary.api-key}") String apiKey,
            @Value("${sphere.cloudinary.api-secret}") String apiSecret
    ) {
        Map<String, String> config = Map.of(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", "true");
        return new Cloudinary(config);
    }
}

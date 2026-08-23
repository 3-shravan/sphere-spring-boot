package com.sphere.post.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import feign.RequestInterceptor;

public class FeignClientConfig {

    @Bean
    public RequestInterceptor internalApiKeyInterceptor(@Value("${sphere.internal.api-key}") String internalApiKey) {
        return requestTemplate -> requestTemplate.header("X-Internal-Api-Key", internalApiKey);
    }
}

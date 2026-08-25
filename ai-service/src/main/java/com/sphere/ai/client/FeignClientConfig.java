package com.sphere.ai.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import feign.RequestInterceptor;

/**
 * Attaches the X-Internal-Api-Key header to every Feign request.
 * Mirrors FeignClientConfig from post-service.
 */
public class FeignClientConfig {

  @Bean
  public RequestInterceptor internalApiKeyInterceptor(@Value("${sphere.internal.api-key}") String internalApiKey) {
    return requestTemplate -> requestTemplate.header("X-Internal-Api-Key", internalApiKey);
  }
}

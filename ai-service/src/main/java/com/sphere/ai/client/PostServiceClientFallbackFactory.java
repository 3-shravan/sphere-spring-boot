package com.sphere.ai.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

/**
 * Fallback factory for PostServiceClient.
 * Returns null for all methods so callers can handle service-unavailable
 * gracefully.
 */
@Component
public class PostServiceClientFallbackFactory implements FallbackFactory<PostServiceClient> {

  private static final Logger log = LoggerFactory.getLogger(PostServiceClientFallbackFactory.class);

  @Override
  public PostServiceClient create(Throwable cause) {
    log.warn("PostServiceClient fallback triggered. cause={}", cause.getMessage());
    return id -> null;
  }
}

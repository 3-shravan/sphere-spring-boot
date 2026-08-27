package com.sphere.post.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

/**
 * Fallback factory for AiServiceClient.
 * Returns null on failure so callers can handle gracefully
 * (caption generation is best-effort, never blocks post operations).
 */
@Component
public class AiServiceClientFallbackFactory implements FallbackFactory<AiServiceClient> {

  private static final Logger log = LoggerFactory.getLogger(AiServiceClientFallbackFactory.class);

  @Override
  public AiServiceClient create(Throwable cause) {
    log.warn("AiServiceClient fallback triggered. ai-service may be unavailable. cause={}", cause.getMessage());
    return new AiServiceClient() {
      @Override
      public CaptionResult getCaptionForImage(String imageUrl) {
        return null;
      }

      @Override
      public TagResult getTagsForImage(String imageUrl) {
        return null;
      }
    };
  }
}

package com.sphere.post.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Feign client to ai-service.
 *
 * Used to fetch an AI-generated caption for a post's image URL.
 * The call happens after the post has been created and its Cloudinary URL
 * is available (the URL is the cache key in ai-service).
 *
 * Resolved via Eureka — no hardcoded host:port.
 * Uses an internal API key (FeignClientConfig) for service-to-service auth.
 */
@FeignClient(name = "AI-SERVICE", path = "/api/v1/ai/caption", configuration = FeignClientConfig.class, fallbackFactory = AiServiceClientFallbackFactory.class)
public interface AiServiceClient {

  /**
   * Retrieves (or triggers generation of) a caption for the given image URL.
   * The ai-service caches results — repeated calls for the same URL are instant.
   *
   * @param imageUrl Publicly accessible Cloudinary URL of the post image.
   * @return Caption result, or null if ai-service is unavailable.
   */
  @GetMapping
  CaptionResult getCaptionForImage(@RequestParam("imageUrl") String imageUrl);
}

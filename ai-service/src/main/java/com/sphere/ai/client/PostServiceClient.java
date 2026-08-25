package com.sphere.ai.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client to post-service's internal API.
 * Used to verify that a post exists before running AI analysis.
 * Resolved via Eureka — no hardcoded host:port.
 */
@FeignClient(name = "POST-SERVICE", path = "/internal/posts", configuration = FeignClientConfig.class, fallbackFactory = PostServiceClientFallbackFactory.class)
public interface PostServiceClient {

  @GetMapping("/{id}")
  PostSummary getPostSummary(@PathVariable("id") Long id);
}

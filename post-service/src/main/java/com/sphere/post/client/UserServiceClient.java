package com.sphere.post.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client to user-service's internal API (docs/02-target-architecture.md
 * "Inter-service communication"). "USER-SERVICE" is resolved via Eureka
 * (Spring Cloud LoadBalancer) — no hardcoded host:port.
 *
 * Every call here goes to /internal/**, authenticated via the shared
 * X-Internal-Api-Key header (see FeignClientConfig), NOT the end user's JWT
 * — post-service is acting on its own behalf to fetch display data, not
 * impersonating the caller.
 */
@FeignClient(name = "USER-SERVICE", path = "/internal/users", configuration = FeignClientConfig.class, fallbackFactory = UserServiceClientFallbackFactory.class)
public interface UserServiceClient {

    @GetMapping("/{id}")
    AuthorSummary getAuthorSummary(@PathVariable("id") Long id);

    @GetMapping("/{id}/following-ids")
    List<Long> getFollowingIds(@PathVariable("id") Long id);

    @GetMapping("/{id}/blocked-ids")
    List<Long> getBlockedIds(@PathVariable("id") Long id);
}

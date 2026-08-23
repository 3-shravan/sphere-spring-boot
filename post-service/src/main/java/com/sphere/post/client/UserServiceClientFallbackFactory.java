package com.sphere.post.client;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import com.sphere.post.exception.NotFoundException;

/**
 * Circuit-breaker fallback for UserServiceClient (see
 * docs/improvements/RECOMMENDED_IMPROVEMENTS.md "Feign resilience").
 *
 * Fallback policy, deliberately explicit rather than silently swallowing
 * every failure the same way:
 *  - getAuthorSummary: the caller (post/comment creation) genuinely cannot
 *    proceed without knowing who the author is — rethrow as NotFoundException
 *    so the create-post/create-comment request fails clearly, rather than
 *    silently creating a post with garbage author data.
 *  - getFollowingIds / getBlockedIds: these only NARROW a feed query (scope
 *    it to following, or exclude blocked authors). Failing open with an
 *    empty list means "show more than intended" (e.g. blocked users
 *    temporarily visible) rather than breaking the feed entirely — an
 *    explicit, logged tradeoff, not a silent one. Revisit if "temporarily
 *    show a blocked user's posts during a user-service outage" is
 *    unacceptable for your product — the safer-but-harsher alternative is
 *    to fail the whole feed request instead.
 */
@Component
public class UserServiceClientFallbackFactory implements FallbackFactory<UserServiceClient> {

    private static final Logger log = LoggerFactory.getLogger(UserServiceClientFallbackFactory.class);

    @Override
    public UserServiceClient create(Throwable cause) {
        return new UserServiceClient() {
            @Override
            public AuthorSummary getAuthorSummary(Long id) {
                log.warn("user-service unavailable resolving author {}: {}", id, cause.getMessage());
                throw new NotFoundException("User not found");
            }

            @Override
            public List<Long> getFollowingIds(Long id) {
                log.warn("user-service unavailable resolving following-ids for {}: {} — feed will fail open (empty scope)", id, cause.getMessage());
                return List.of();
            }

            @Override
            public List<Long> getBlockedIds(Long id) {
                log.warn("user-service unavailable resolving blocked-ids for {}: {} — feed will fail open (no exclusions)", id, cause.getMessage());
                return List.of();
            }
        };
    }
}

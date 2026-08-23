package com.sphere.post.client;

/** Mirrors user-service's AuthorSummaryResponse (GET /internal/users/{id}). */
public record AuthorSummary(Long id, String name, String profilePicture) {
}

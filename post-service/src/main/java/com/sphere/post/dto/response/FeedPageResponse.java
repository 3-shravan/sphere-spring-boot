package com.sphere.post.dto.response;

import java.util.List;

/** Ports the shared paginateQuery() shape: { currentPage, totalPages, hasMore, posts }. */
public record FeedPageResponse(
        int currentPage,
        int totalPages,
        boolean hasMore,
        List<PostResponse> posts
) {
}

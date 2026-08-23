package com.sphere.post.dto.response;

import java.time.Instant;
import java.util.List;

import com.sphere.post.entity.PostType;

public record PostResponse(
        Long id,
        AuthorResponse author,
        PostType postType,
        String thoughts,
        String caption,
        String media,
        String location,
        List<String> tags,
        long likesCount,
        boolean likedByCurrentUser,
        long commentsCount,
        Boolean isSaved,
        List<com.sphere.post.client.AuthorSummary> recentLikers,
        Instant createdAt,
        Instant updatedAt
) {
}

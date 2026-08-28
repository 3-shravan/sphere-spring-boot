package com.sphere.post.dto.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sphere.post.entity.PostType;

/**
 * Primary Post DTO containing:
 * 1. Entity Information (caption, media, tags, author, etc.)
 * 2. Aggregated Counts (likesCount, commentsCount)
 * 3. Dynamic User State Flags (likedByCurrentUser, isLiked, isSaved)
 *
 * Excludes large collections (likes[], comments[], bookmarks[]) per Social Media Relationship Architecture.
 */
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
        Instant createdAt,
        Instant updatedAt
) {
    @JsonProperty("isLiked")
    public boolean isLiked() {
        return likedByCurrentUser;
    }
}

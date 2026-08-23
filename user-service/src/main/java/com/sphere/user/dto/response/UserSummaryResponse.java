package com.sphere.user.dto.response;

/** Lightweight projection (name + profilePicture) — mirrors the .select("name profilePicture") pattern used throughout the source for embedding authors/followers/following in other responses. */
public record UserSummaryResponse(
        Long id,
        String name,
        String profilePicture
) {
}

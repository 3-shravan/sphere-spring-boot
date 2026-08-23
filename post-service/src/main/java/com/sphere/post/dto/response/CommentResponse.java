package com.sphere.post.dto.response;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** Nested tree shape — mirrors the recursive tree post.controller.js builds in application code for GET /posts/:postId/comments. */
public record CommentResponse(
        Long id,
        AuthorResponse author,
        String comment,
        Long parentCommentId,
        Instant createdAt,
        List<CommentResponse> replies
) {
    public static CommentResponse withReplies(CommentResponse base, List<CommentResponse> replies) {
        return new CommentResponse(base.id(), base.author(), base.comment(), base.parentCommentId(), base.createdAt(), replies);
    }

    public static List<CommentResponse> emptyReplies() {
        return new ArrayList<>();
    }
}

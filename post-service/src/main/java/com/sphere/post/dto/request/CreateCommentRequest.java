package com.sphere.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Ports validations/post.schemas.js#commnetPostSchema. */
public record CreateCommentRequest(
        @NotBlank(message = "Please enter a comment")
        @Size(max = 500, message = "Comment should be less than 500 characters.")
        String comment,
        Long parentId
) {
}

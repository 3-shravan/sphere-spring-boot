package com.sphere.post.dto.request;

import jakarta.validation.constraints.Size;

/** Ports validations/post.schemas.js#updatePostSchema. */
public record UpdatePostRequest(
        @Size(max = 300, message = "Caption should be less than 300 characters.")
        String caption,
        @Size(max = 50, message = "Location should be less than 50 characters.")
        String location,
        String tags
) {
}

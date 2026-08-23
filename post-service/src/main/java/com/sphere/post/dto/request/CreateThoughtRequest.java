package com.sphere.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Ports validations/post.schemas.js#addThoughtSchema. */
public record CreateThoughtRequest(
        @NotBlank(message = "Thoughts are required")
        @Size(min = 1, max = 2000, message = "Thoughts should be less than 2000 characters.")
        String thoughts
) {
}

package com.sphere.post.dto.request;

import jakarta.validation.constraints.Size;

/** Ports validations/post.schemas.js#addPostSchema (multipart form fields; image is a separate MultipartFile param). tags arrives as a JSON-stringified array string, parsed in the service (mirrors parseArray in the source). */
public record CreatePostRequest(
        @Size(max = 300, message = "Caption should be less than 300 characters.")
        String caption,
        @Size(max = 50, message = "Location should be less than 50 characters.")
        String location,
        String tags
) {
}

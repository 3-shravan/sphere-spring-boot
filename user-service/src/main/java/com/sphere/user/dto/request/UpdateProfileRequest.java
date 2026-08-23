package com.sphere.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Ports validations/user.schemas.js#updateProfileSchema. Multipart form fields; profilePicture arrives as a separate MultipartFile param. */
public record UpdateProfileRequest(
        @NotBlank(message = "Username is required.")
        @Size(min = 3, max = 20, message = "Username must be at least 3 characters.")
        @Pattern(regexp = "^[a-z0-9._]+$", message = "username can only contain lowercase letters, numbers, dots, and underscores")
        String name,

        @Size(max = 50, message = "your full name should be less than 32 characters.")
        String fullName,

        @Size(max = 220, message = "Bio should be less than 220 characters.")
        String bio,

        String gender,

        String dob
) {
}

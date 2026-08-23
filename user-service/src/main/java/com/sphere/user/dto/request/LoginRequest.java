package com.sphere.user.dto.request;

import jakarta.validation.constraints.NotBlank;

/** Ports validations/auth.schemas.js#loginSchema. */
public record LoginRequest(
        @NotBlank(message = "email is required")
        String email,
        @NotBlank(message = "password is required")
        String password
) {
}

package com.sphere.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Ports validations/auth.schemas.js#resetPasswordBodySchema. */
public record ResetPasswordRequest(
        @NotBlank(message = "New password is required")
        @Size(min = 6, message = "New password must be at least 6 characters long")
        String newPassword,

        @NotBlank(message = "Confirm password is required")
        String confirmPassword
) {
}

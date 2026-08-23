package com.sphere.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Ports validations/auth.schemas.js#registerSchema.
 *
 * DEVIATION (documented, Decision #4 default = keep phone as an optional
 * field but registration-via-phone stays unavailable): verificationMethod
 * is still accepted on the wire for frontend compatibility, but only
 * "email" is a valid value now that Twilio/phone verification is excluded
 * (see docs/exclusions/TWILIO_EXCLUDED.md). Submitting "phone" returns a
 * clear 400, matching the tone of the source's own
 * "...unavailable for now. Please try email verification instead." copy.
 */
public record RegisterRequest(

        @NotBlank(message = "username is required")
        @Size(min = 3, max = 20, message = "username should have at least 3 characters")
        @Pattern(regexp = "^[a-z0-9._]+$", message = "username can only contain lowercase letters, numbers, dots, and underscores")
        String name,

        @Email(message = "email must be a valid email")
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 6, message = "password must be at least 6 characters")
        String password
) {
}

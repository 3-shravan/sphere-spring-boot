package com.sphere.user.dto.request;

/** Ports validations/auth.schemas.js#forgotPasswordSchema (email path only — see Twilio exclusion). */
public record ForgetPasswordRequest(
        String email
) {
}

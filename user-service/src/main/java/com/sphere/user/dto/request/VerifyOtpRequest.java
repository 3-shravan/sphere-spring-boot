package com.sphere.user.dto.request;

import jakarta.validation.constraints.NotBlank;

/** Ports validations/auth.schemas.js#otpVerificationSchema (email-only path). */
public record VerifyOtpRequest(
        String email,
        @NotBlank(message = "OTP is required")
        String otp
) {
}

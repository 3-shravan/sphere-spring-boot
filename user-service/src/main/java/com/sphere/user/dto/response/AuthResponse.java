package com.sphere.user.dto.response;

/** Ports services/auth.services.js#sendToken's JSON body shape: { token, user }. */
public record AuthResponse(
        String token,
        UserResponse user
) {
}

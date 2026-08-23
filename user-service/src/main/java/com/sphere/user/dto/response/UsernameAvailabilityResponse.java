package com.sphere.user.dto.response;

/**
 * Ports auth.controller.js#usernameAvailability's NON-standard envelope:
 * { available, message } — no "success" key. Preserved exactly since the
 * frontend reads `available` directly.
 */
public record UsernameAvailabilityResponse(boolean available, String message) {
}

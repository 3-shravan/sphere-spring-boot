package com.sphere.user.exception;

import org.springframework.http.HttpStatus;

/**
 * Source uses raw ApiError(429, ...) for the resend-attempts rate limit
 * (services/user.services.js#handleUnverifiedUser) without a named
 * ErrorTypes entry — we mirror that by reusing BadRequest's type string
 * isn't right either, so we introduce ServiceUnavailable's sibling status
 * with a dedicated type-less 429. Since the source's ErrorTypes enum has no
 * "TooManyRequests" entry, we deliberately reuse "BadRequest" as the `type`
 * field for frontend compatibility (the frontend has no special handling for
 * 429 anyway — it falls through to the generic fallback branch either way),
 * while keeping the correct 429 HTTP status.
 */
public class TooManyRequestsException extends ApiException {
    public TooManyRequestsException(String message) {
        super(HttpStatus.TOO_MANY_REQUESTS, ErrorType.BadRequest, message);
    }
}

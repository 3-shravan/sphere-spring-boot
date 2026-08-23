package com.sphere.post.exception;

/** Mirrors user-service's ErrorType exactly — same wire contract across all services (see docs/api/API_INVENTORY.md). */
public enum ErrorType {
    BadRequest, Unauthorized, NotFound, ValidationError, Forbidden,
    Conflict, InternalServerError, ServiceUnavailable, TokenExpired, BadToken, AccessTokenError
}

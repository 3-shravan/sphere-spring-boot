package com.sphere.user.exception;

/**
 * String values match server/src/core/errors/apiError.js's ErrorTypes
 * EXACTLY. The React frontend's error-normalizer.js / response-interceptor.js
 * branch on this literal string (not just HTTP status) to decide auth-redirect
 * vs. validation-display vs. generic-toast behavior — do not rename these.
 */
public enum ErrorType {
    BadRequest,
    Unauthorized,
    NotFound,
    ValidationError,
    Forbidden,
    Conflict,
    InternalServerError,
    ServiceUnavailable,
    TokenExpired,
    BadToken,
    AccessTokenError
}

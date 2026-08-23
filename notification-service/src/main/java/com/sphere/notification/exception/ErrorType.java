package com.sphere.notification.exception;

/** Same string contract as the other services — see docs/api/API_INVENTORY.md. */
public enum ErrorType {
    BadRequest, Unauthorized, NotFound, ValidationError, Forbidden,
    Conflict, InternalServerError, ServiceUnavailable, TokenExpired, BadToken, AccessTokenError
}

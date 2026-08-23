package com.sphere.post.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends ApiException {
    public TokenExpiredException(String message) { super(HttpStatus.UNAUTHORIZED, ErrorType.TokenExpired, message); }
}

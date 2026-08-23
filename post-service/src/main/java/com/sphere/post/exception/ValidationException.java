package com.sphere.post.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends ApiException {
    public ValidationException(String message) { super(HttpStatus.UNPROCESSABLE_CONTENT, ErrorType.ValidationError, message); }
}

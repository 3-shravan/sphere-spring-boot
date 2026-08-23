package com.sphere.user.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

/** Base exception, ports core/errors/apiError.js. */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final ErrorType type;

    public ApiException(HttpStatus status, ErrorType type, String message) {
        super(message);
        this.status = status;
        this.type = type;
    }
}

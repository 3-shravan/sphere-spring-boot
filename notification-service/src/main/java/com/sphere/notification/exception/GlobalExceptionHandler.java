package com.sphere.notification.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sphere.notification.controller.ErrorResponse;

/** This service's only real failure mode is validation on the one internal publish endpoint — kept minimal on purpose. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String firstMessage = ex.getBindingResult().getFieldErrors().stream()
                .findFirst().map(err -> err.getField() + ": " + err.getDefaultMessage()).orElse("Validation error");
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT)
                .body(ErrorResponse.of(ErrorType.ValidationError.name(), firstMessage));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(ErrorType.InternalServerError.name(), "Internal server error"));
    }
}

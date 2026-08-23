package com.sphere.post.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.sphere.post.dto.response.ErrorResponse;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

/**
 * Ports server/src/middlewares/errMiddleware.js — identical contract to
 * user-service's handler.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
        return respond(ex.getStatus(), ex.getType().name(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String firstMessage = ex.getBindingResult().getFieldErrors().stream()
                .findFirst().map(err -> err.getDefaultMessage()).orElse("Validation error");
        return respond(HttpStatus.UNPROCESSABLE_CONTENT, ErrorType.ValidationError.name(), firstMessage);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMessage());
        return respond(HttpStatus.CONFLICT, ErrorType.Conflict.name(), "Duplicate or conflicting resource.");
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwt(ExpiredJwtException ex) {
        return respond(HttpStatus.UNAUTHORIZED, ErrorType.TokenExpired.name(), "Token expired, login again!");
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleBadJwt(JwtException ex) {
        return respond(HttpStatus.UNAUTHORIZED, ErrorType.BadToken.name(), "Token is invalid, try again!");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return respond(HttpStatus.FORBIDDEN, ErrorType.Forbidden.name(), "You do not have permission for this action.");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return respond(HttpStatus.BAD_REQUEST, ErrorType.BadRequest.name(), "Invalid parameter type: " + ex.getValue());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex) {
        log.error("Unhandled exception", ex);
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError.name(), "Internal server error");
    }

    private ResponseEntity<ErrorResponse> respond(HttpStatus status, String type, String message) {
        return ResponseEntity.status(status).body(ErrorResponse.of(type, message));
    }
}

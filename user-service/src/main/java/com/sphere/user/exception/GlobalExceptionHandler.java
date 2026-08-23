package com.sphere.user.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sphere.user.dto.response.ErrorResponse;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

/**
 * Ports server/src/middlewares/errMiddleware.js. Every branch here maps to
 * an equivalent branch in the Node source — see inline comments for the
 * exact correspondence.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
        return respond(ex.getStatus(), ex.getType().name(), ex.getMessage());
    }

    // Bean Validation failures (Jakarta @Valid on request DTOs) — ports the
    // Joi-based `validate`/`validateRequest` middlewares, which surface only
    // the FIRST validation error message (errors[0]), not the full list.
    @ExceptionHandler({MethodArgumentNotValidException.class, org.springframework.validation.BindException.class})
    public ResponseEntity<ErrorResponse> handleValidation(Exception ex) {
        String firstMessage = "Validation error";
        if (ex instanceof MethodArgumentNotValidException) {
            firstMessage = ((MethodArgumentNotValidException) ex).getBindingResult().getFieldErrors().stream()
                    .findFirst()
                    .map(err -> err.getDefaultMessage())
                    .orElse("Validation error");
        } else if (ex instanceof org.springframework.validation.BindException) {
            firstMessage = ((org.springframework.validation.BindException) ex).getBindingResult().getFieldErrors().stream()
                    .findFirst()
                    .map(err -> err.getDefaultMessage())
                    .orElse("Validation error");
        }
        return respond(HttpStatus.UNPROCESSABLE_ENTITY, ErrorType.ValidationError.name(), firstMessage);
    }

    // Postgres unique-constraint violation — equivalent to Mongo's
    // `err.code === 11000` duplicate-key branch in errMiddleware.js.
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

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return respond(HttpStatus.BAD_REQUEST, ErrorType.BadRequest.name(), "Incorrect credentials");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return respond(HttpStatus.FORBIDDEN, ErrorType.Forbidden.name(), "You do not have permission for this action.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex) {
        log.error("Unhandled exception", ex);
        try {
            java.nio.file.Files.writeString(java.nio.file.Paths.get("error_log.txt"), ex.toString() + "\n" + java.util.Arrays.toString(ex.getStackTrace()));
        } catch(Exception ignored) {}
        String details = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getName();
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError.name(), "Internal Error: " + details);
    }

    private ResponseEntity<ErrorResponse> respond(HttpStatus status, String type, String message) {
        return ResponseEntity.status(status).body(ErrorResponse.of(type, message));
    }
}

package com.sphere.notification.exception;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sphere.notification.controller.ErrorResponse;
import com.sphere.notification.controller.ErrorResponse.ValidationErrorDetail;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Production-grade Centralized Exception Handler for notification-service.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        List<ValidationErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new ValidationErrorDetail(
                        err.getField(),
                        err.getDefaultMessage() != null ? err.getDefaultMessage() : "Invalid value",
                        err.getRejectedValue()))
                .collect(Collectors.toList());

        String summary = errors.isEmpty()
                ? "Validation failed"
                : "Validation failed for: " + errors.stream().map(ValidationErrorDetail::field).collect(Collectors.joining(", "));

        log.warn("[traceId={}] Validation failure at {}: {}", traceId, request.getRequestURI(), summary);
        return respond(HttpStatus.UNPROCESSABLE_ENTITY, ErrorType.ValidationError.name(), summary, request, traceId, errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        log.error("[traceId={}] Unhandled exception in notification-service at {}: {}", traceId, request.getRequestURI(), ex.getMessage(), ex);
        String message = "An internal server error occurred. Reference Trace ID: " + traceId;
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError.name(), message, request, traceId, null);
    }

    private ResponseEntity<ErrorResponse> respond(
            HttpStatus status,
            String type,
            String message,
            HttpServletRequest request,
            String traceId,
            List<ValidationErrorDetail> errors) {
        String path = request != null ? request.getRequestURI() : null;
        ErrorResponse response = ErrorResponse.of(type, message, status.value(), path, traceId, errors);
        return ResponseEntity.status(status).body(response);
    }

    private String getOrCreateTraceId(HttpServletRequest request) {
        if (request != null) {
            String headerTraceId = request.getHeader("X-Trace-Id");
            if (headerTraceId != null && !headerTraceId.isBlank()) {
                return headerTraceId;
            }
            String correlationId = request.getHeader("X-Correlation-Id");
            if (correlationId != null && !correlationId.isBlank()) {
                return correlationId;
            }
        }
        return UUID.randomUUID().toString();
    }
}

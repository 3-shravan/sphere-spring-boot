package com.sphere.ai.exception;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.sphere.ai.dto.response.ErrorResponse;
import com.sphere.ai.dto.response.ErrorResponse.ValidationErrorDetail;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

/**
 * Production-grade Centralized Exception Handler for ai-service.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        log.warn("[traceId={}] API Exception: {} (status: {}) at {}", traceId, ex.getMessage(), ex.getStatus(), request.getRequestURI());
        return respond(ex.getStatus(), ex.getType().name(), ex.getMessage(), request, traceId, null);
    }

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

        log.warn("[traceId={}] Validation failure: {} at {}", traceId, summary, request.getRequestURI());
        return respond(HttpStatus.UNPROCESSABLE_ENTITY, ErrorType.ValidationError.name(), summary, request, traceId, errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        List<ValidationErrorDetail> errors = ex.getConstraintViolations().stream()
                .map(cv -> new ValidationErrorDetail(
                        cv.getPropertyPath().toString(),
                        cv.getMessage(),
                        cv.getInvalidValue()))
                .collect(Collectors.toList());

        log.warn("[traceId={}] Constraint violation at {}: {}", traceId, request.getRequestURI(), ex.getMessage());
        return respond(HttpStatus.BAD_REQUEST, ErrorType.ValidationError.name(), "Constraint validation failed", request, traceId, errors);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        String paramName = ex.getName();
        Object val = ex.getValue();
        String expectedType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "valid format";
        String message = String.format("Invalid parameter '%s': expected %s, received '%s'", paramName, expectedType, val);

        log.warn("[traceId={}] Type mismatch on parameter '{}' with value '{}' at {}", traceId, paramName, val, request.getRequestURI());
        return respond(HttpStatus.BAD_REQUEST, ErrorType.BadRequest.name(), message, request, traceId, null);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        String message = String.format("Required request parameter '%s' of type %s is missing", ex.getParameterName(), ex.getParameterType());
        log.warn("[traceId={}] Missing parameter '{}' at {}", traceId, ex.getParameterName(), request.getRequestURI());
        return respond(HttpStatus.BAD_REQUEST, ErrorType.BadRequest.name(), message, request, traceId, null);
    }

    @ExceptionHandler(MissingPathVariableException.class)
    public ResponseEntity<ErrorResponse> handleMissingPathVariable(MissingPathVariableException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        String message = String.format("Required path variable '%s' is missing", ex.getVariableName());
        log.warn("[traceId={}] Missing path variable '{}' at {}", traceId, ex.getVariableName(), request.getRequestURI());
        return respond(HttpStatus.BAD_REQUEST, ErrorType.BadRequest.name(), message, request, traceId, null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        log.warn("[traceId={}] HttpMessageNotReadable at {}: {}", traceId, request.getRequestURI(), ex.getMessage());
        return respond(HttpStatus.BAD_REQUEST, ErrorType.BadRequest.name(), "Malformed request body or incompatible data types", request, traceId, null);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        String message = String.format("HTTP method '%s' not supported for this endpoint. Supported methods: %s", ex.getMethod(), ex.getSupportedHttpMethods());
        return respond(HttpStatus.METHOD_NOT_ALLOWED, ErrorType.BadRequest.name(), message, request, traceId, null);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        String message = String.format("Content type '%s' is not supported. Supported types: %s", ex.getContentType(), ex.getSupportedMediaTypes());
        return respond(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ErrorType.BadRequest.name(), message, request, traceId, null);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        String message = String.format("Resource not found for %s %s", request.getMethod(), request.getRequestURI());
        return respond(HttpStatus.NOT_FOUND, ErrorType.NotFound.name(), message, request, traceId, null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        log.warn("[traceId={}] Data integrity violation at {}: {}", traceId, request.getRequestURI(), ex.getMessage());
        return respond(HttpStatus.CONFLICT, ErrorType.Conflict.name(), "Database integrity violation", request, traceId, null);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwt(ExpiredJwtException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        return respond(HttpStatus.UNAUTHORIZED, ErrorType.TokenExpired.name(), "Token expired, please login again", request, traceId, null);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleBadJwt(JwtException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        return respond(HttpStatus.UNAUTHORIZED, ErrorType.BadToken.name(), "Invalid or corrupt token, please login again", request, traceId, null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        return respond(HttpStatus.FORBIDDEN, ErrorType.Forbidden.name(), "You do not have permission to perform this action", request, traceId, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex, HttpServletRequest request) {
        String traceId = getOrCreateTraceId(request);
        log.error("[traceId={}] Unhandled server exception at {}: {}", traceId, request.getRequestURI(), ex.getMessage(), ex);
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

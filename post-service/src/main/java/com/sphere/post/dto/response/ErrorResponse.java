package com.sphere.post.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        boolean success,
        String type,
        String message,
        int status,
        String timestamp,
        String path,
        String traceId,
        List<ValidationErrorDetail> errors,
        Object data) {

    public record ValidationErrorDetail(
            String field,
            String message,
            Object rejectedValue) {
    }

    public static ErrorResponse of(String type, String message, int status, String path, String traceId, List<ValidationErrorDetail> errors) {
        String effectiveTraceId = (traceId != null && !traceId.isBlank()) ? traceId : UUID.randomUUID().toString();
        return new ErrorResponse(
                false,
                type,
                message,
                status,
                Instant.now().toString(),
                path,
                effectiveTraceId,
                errors,
                null);
    }

    public static ErrorResponse of(String type, String message, int status, String path, String traceId) {
        return of(type, message, status, path, traceId, null);
    }

    public static ErrorResponse of(String type, String message) {
        return of(type, message, 500, null, null, null);
    }
}

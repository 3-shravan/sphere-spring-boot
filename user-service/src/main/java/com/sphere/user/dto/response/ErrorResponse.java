package com.sphere.user.dto.response;

/**
 * Exact shape of server/src/core/errors/apiError.js's ApiError.handle():
 * { success: false, type, message, data: null }
 */
public record ErrorResponse(boolean success, String type, String message, Object data) {
    public static ErrorResponse of(String type, String message) {
        return new ErrorResponse(false, type, message, null);
    }
}

package com.sphere.post.dto.response;

public record ErrorResponse(boolean success, String type, String message, Object data) {
    public static ErrorResponse of(String type, String message) {
        return new ErrorResponse(false, type, message, null);
    }
}

package com.sphere.post.util;

import java.util.LinkedHashMap;
import java.util.Map;

/** Mirrors user-service's ResponseUtil — replicates handleSuccessResponse's top-level spread shape. */
public final class ResponseUtil {

    private ResponseUtil() {
    }

    public static Map<String, Object> success(String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", message);
        return body;
    }

    public static Map<String, Object> success(String message, Map<String, ?> extraFields) {
        Map<String, Object> body = success(message);
        if (extraFields != null) body.putAll(extraFields);
        return body;
    }
}

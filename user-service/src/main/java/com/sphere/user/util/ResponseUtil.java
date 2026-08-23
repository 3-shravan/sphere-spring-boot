package com.sphere.user.util;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Ports utils/responseHandler.js#handleSuccessResponse, which does
 * `{ success: true, message, ...data }` — i.e. the extra fields are spread
 * at the TOP level of the JSON object, not nested under a "data" key. This
 * is a real, load-bearing part of the frontend contract (see
 * docs/api/FRONTEND_API_CONTRACT.md) so we replicate the flattening exactly
 * with a LinkedHashMap instead of a fixed-shape response record.
 */
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
        if (extraFields != null) {
            body.putAll(extraFields);
        }
        return body;
    }

    public static Map<String, Object> of(String key, Object value) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put(key, value);
        return map;
    }
}

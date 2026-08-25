package com.sphere.ai.util;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Mirrors ResponseUtil from post-service — consistent success response shape.
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
    if (extraFields != null)
      body.putAll(extraFields);
    return body;
  }
}

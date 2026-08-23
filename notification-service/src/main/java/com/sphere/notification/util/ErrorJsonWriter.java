package com.sphere.notification.util;

/** Same pattern as user-service/post-service — see their javadoc for the Spring Boot 4 / Jackson 3 rationale. */
public final class ErrorJsonWriter {

    private ErrorJsonWriter() {
    }

    public static String write(String type, String message) {
        return "{\"success\":false,\"type\":\"" + escape(type) + "\",\"message\":\"" + escape(message) + "\",\"data\":null}";
    }

    private static String escape(String value) {
        if (value == null) return "";
        StringBuilder sb = new StringBuilder(value.length() + 8);
        for (char c : value.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}

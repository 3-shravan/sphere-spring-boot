package com.sphere.post.client;

import java.util.List;

/**
 * Minimal tags result from ai-service.
 */
public record TagResult(
    List<String> tags,
    boolean cached) {
}

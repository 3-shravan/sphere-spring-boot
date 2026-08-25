package com.sphere.post.client;

/**
 * Minimal caption result from ai-service.
 * Matches the shape of ai-service's ImageAnalysisResponse.
 */
public record CaptionResult(
    String caption,
    boolean cached) {
}

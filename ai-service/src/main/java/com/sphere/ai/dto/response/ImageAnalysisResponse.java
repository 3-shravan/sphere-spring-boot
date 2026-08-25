package com.sphere.ai.dto.response;

import java.time.Instant;

import com.sphere.ai.entity.PostAiMetadata;

/**
 * Returned by all caption endpoints.
 * {@code cached=true} means the caption was served from the database
 * without calling the AI provider.
 */
public record ImageAnalysisResponse(
    Long id,
    String imageUrl,
    String caption,
    String aiProvider,
    String modelVersion,
    boolean cached,
    Instant createdAt) {
  public static ImageAnalysisResponse from(PostAiMetadata entity, boolean cached) {
    return new ImageAnalysisResponse(
        entity.getId(),
        entity.getImageUrl(),
        entity.getCaption(),
        entity.getAiProvider(),
        entity.getModelVersion(),
        cached,
        entity.getCreatedAt());
  }

  public static ImageAnalysisResponse fresh(String caption, String aiProvider, String modelVersion) {
    return new ImageAnalysisResponse(null, null, caption, aiProvider, modelVersion, false, null);
  }
}

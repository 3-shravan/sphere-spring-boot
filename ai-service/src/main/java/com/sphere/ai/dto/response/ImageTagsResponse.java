package com.sphere.ai.dto.response;

import java.time.Instant;
import java.util.List;

import com.sphere.ai.entity.PostAiMetadata;

/**
 * Returned by all image tags endpoints.
 * {@code cached=true} means tags were served from the database
 * without calling the AI provider.
 */
public record ImageTagsResponse(
    Long id,
    String imageUrl,
    List<String> tags,
    String aiProvider,
    String modelVersion,
    boolean cached,
    Instant createdAt) {

  public static ImageTagsResponse from(PostAiMetadata entity, List<String> tags, boolean cached) {
    return new ImageTagsResponse(
        entity.getId(),
        entity.getImageUrl(),
        tags,
        entity.getAiProvider(),
        entity.getModelVersion(),
        cached,
        entity.getCreatedAt());
  }

  public static ImageTagsResponse fresh(List<String> tags, String aiProvider, String modelVersion) {
    return new ImageTagsResponse(null, null, tags, aiProvider, modelVersion, false, null);
  }
}

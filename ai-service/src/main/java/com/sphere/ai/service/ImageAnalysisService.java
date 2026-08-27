package com.sphere.ai.service;

import com.sphere.ai.dto.response.ImageAnalysisResponse;
import com.sphere.ai.dto.response.ImageTagsResponse;

/**
 * AI caption generation service.
 *
 * Feature #1: Image Caption Generation.
 * - URL-based: result is cached in the database by imageUrl.
 * - File/bytes-based: result is returned directly, no caching.
 *
 * Future features are added as new service interfaces alongside this one.
 */
public interface ImageAnalysisService {

  /**
   * Generates (or returns cached) caption for the image at the given URL.
   *
   * @param imageUrl Publicly accessible image URL.
   * @return Caption response (cached=true if served from DB).
   */
  ImageAnalysisResponse generateCaption(String imageUrl);

  /**
   * Generates a caption from raw image bytes (direct file upload path).
   * Result is NOT cached — no persistent imageUrl key available.
   *
   * @param bytes       Raw image bytes from the uploaded file.
   * @param contentType MIME type string, e.g. "image/jpeg".
   * @return Caption response (cached=false always).
   */
  ImageAnalysisResponse generateCaptionFromBytes(byte[] bytes, String contentType);

  /**
   * Generates (or returns cached) tags for the image at the given URL.
   *
   * @param imageUrl Publicly accessible image URL.
   * @return Tags response (cached=true if served from DB).
   */
  ImageTagsResponse generateTags(String imageUrl);

  /**
   * Generates tags from raw image bytes (direct file upload path).
   * Result is NOT cached — no persistent imageUrl key available.
   *
   * @param bytes       Raw image bytes from the uploaded file.
   * @param contentType MIME type string, e.g. "image/jpeg".
   * @return Tags response (cached=false always).
   */
  ImageTagsResponse generateTagsFromBytes(byte[] bytes, String contentType);
}

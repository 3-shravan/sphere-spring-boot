package com.sphere.ai.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;

import com.sphere.ai.ai.prompt.PromptService;
import com.sphere.ai.ai.provider.AiProvider;
import com.sphere.ai.dto.response.ImageAnalysisResponse;
import com.sphere.ai.entity.PostAiMetadata;
import com.sphere.ai.repository.PostAiMetadataRepository;
import com.sphere.ai.service.ImageAnalysisService;

import lombok.RequiredArgsConstructor;

/**
 * Feature #1 — Image Caption Generation.
 *
 * URL-based flow (cached):
 * 1. Check DB for existing caption by imageUrl.
 * 2. If found → return immediately (cached=true).
 * 3. If not found → call AI provider → persist → return (cached=false).
 *
 * File/bytes-based flow (not cached):
 * 1. Call AI provider with raw image bytes.
 * 2. Return caption directly without persisting.
 *
 * The service depends on AiProvider (abstraction) and PromptService.
 * Swapping the AI model or provider requires no changes here.
 */
@Service
@RequiredArgsConstructor
public class ImageAnalysisServiceImpl implements ImageAnalysisService {

  private static final Logger log = LoggerFactory.getLogger(ImageAnalysisServiceImpl.class);

  private final PostAiMetadataRepository repository;
  private final AiProvider aiProvider;
  private final PromptService promptService;

  // ------------------------------------------------------------------
  // URL-based (cached)
  // ------------------------------------------------------------------

  @Override
  @Transactional
  public ImageAnalysisResponse generateCaption(String imageUrl) {
    // Cache hit
    return repository.findByImageUrl(imageUrl)
        .map(existing -> {
          log.info("Caption cache hit for imageUrl={}", imageUrl);
          return ImageAnalysisResponse.from(existing, true);
        })
        .orElseGet(() -> {
          log.info("Caption cache miss — calling AI provider. imageUrl={}", imageUrl);
          String caption = aiProvider.analyzeImage(imageUrl, promptService.imageCaptionPrompt());
          PostAiMetadata saved = repository.save(
              PostAiMetadata.builder()
                  .imageUrl(imageUrl)
                  .caption(caption.trim())
                  .aiProvider(aiProvider.providerName())
                  .modelVersion(aiProvider.modelVersion())
                  .build());
          log.info("Caption generated and cached. id={} imageUrl={}", saved.getId(), imageUrl);
          return ImageAnalysisResponse.from(saved, false);
        });
  }

  // ------------------------------------------------------------------
  // File/bytes-based (not cached)
  // ------------------------------------------------------------------

  @Override
  public ImageAnalysisResponse generateCaptionFromBytes(byte[] bytes, String contentType) {
    log.info("Generating caption from uploaded file. bytes={} contentType={}", bytes.length, contentType);
    MimeType mimeType = parseMimeType(contentType);
    String caption = aiProvider.analyzeImageBytes(bytes, mimeType, promptService.imageCaptionPrompt());
    log.info("Caption generated from file upload.");
    return ImageAnalysisResponse.fresh(caption.trim(), aiProvider.providerName(), aiProvider.modelVersion());
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  private MimeType parseMimeType(String contentType) {
    if (contentType == null)
      return MimeTypeUtils.IMAGE_JPEG;
    try {
      return MimeTypeUtils.parseMimeType(contentType);
    } catch (Exception e) {
      return MimeTypeUtils.IMAGE_JPEG;
    }
  }
}

package com.sphere.ai.service.impl;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sphere.ai.ai.prompt.PromptService;
import com.sphere.ai.ai.provider.AiProvider;
import com.sphere.ai.dto.response.ImageAnalysisResponse;
import com.sphere.ai.dto.response.ImageTagsResponse;
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
  private final ObjectMapper objectMapper = new ObjectMapper();

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
  // URL-based tags (cached)
  // ------------------------------------------------------------------

  @Override
  @Transactional
  public ImageTagsResponse generateTags(String imageUrl) {
    return repository.findByImageUrl(imageUrl)
        .filter(existing -> existing.getTagsJson() != null && !existing.getTagsJson().isBlank())
        .map(existing -> {
          log.info("Tags cache hit for imageUrl={}", imageUrl);
          return ImageTagsResponse.from(existing, parseTagsJson(existing.getTagsJson()), true);
        })
        .orElseGet(() -> {
          log.info("Tags cache miss — calling AI provider. imageUrl={}", imageUrl);
          String raw = aiProvider.analyzeImage(imageUrl, promptService.imageTagsPrompt());
          List<String> tags = normalizeTags(raw);

          PostAiMetadata metadata = repository.findByImageUrl(imageUrl)
              .orElseGet(() -> PostAiMetadata.builder().imageUrl(imageUrl).build());

          metadata.setTagsJson(toTagsJson(tags));
          metadata.setAiProvider(aiProvider.providerName());
          metadata.setModelVersion(aiProvider.modelVersion());

          PostAiMetadata saved = repository.save(metadata);
          log.info("Tags generated and cached. id={} imageUrl={}", saved.getId(), imageUrl);
          return ImageTagsResponse.from(saved, tags, false);
        });
  }

  // ------------------------------------------------------------------
  // File/bytes-based tags (not cached)
  // ------------------------------------------------------------------

  @Override
  public ImageTagsResponse generateTagsFromBytes(byte[] bytes, String contentType) {
    log.info("Generating tags from uploaded file. bytes={} contentType={}", bytes.length, contentType);
    MimeType mimeType = parseMimeType(contentType);
    String raw = aiProvider.analyzeImageBytes(bytes, mimeType, promptService.imageTagsPrompt());
    List<String> tags = normalizeTags(raw);
    log.info("Tags generated from file upload.");
    return ImageTagsResponse.fresh(tags, aiProvider.providerName(), aiProvider.modelVersion());
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

  private List<String> parseTagsJson(String tagsJson) {
    if (tagsJson == null || tagsJson.isBlank())
      return List.of();
    try {
      String[] tags = objectMapper.readValue(tagsJson, String[].class);
      return tags == null ? List.of() : List.of(tags);
    } catch (JsonProcessingException e) {
      return List.of();
    }
  }

  private String toTagsJson(List<String> tags) {
    try {
      return objectMapper.writeValueAsString(tags == null ? List.of() : tags);
    } catch (JsonProcessingException e) {
      return "[]";
    }
  }

  private List<String> normalizeTags(String raw) {
    if (raw == null || raw.isBlank())
      return List.of();

    List<String> parsed;
    try {
      String[] fromJson = objectMapper.readValue(raw, String[].class);
      parsed = fromJson == null ? List.of() : List.of(fromJson);
    } catch (JsonProcessingException e) {
      parsed = Arrays.stream(raw.split("[,\\n]"))
          .map(String::trim)
          .toList();
    }

    Set<String> deduped = new LinkedHashSet<>();
    for (String tag : parsed) {
      String normalized = sanitizeTag(tag);
      if (!normalized.isBlank()) {
        deduped.add(normalized);
      }
      if (deduped.size() >= 10) {
        break;
      }
    }

    return List.copyOf(deduped);
  }

  private String sanitizeTag(String value) {
    if (value == null)
      return "";
    String tag = value.trim().toLowerCase(Locale.ROOT);
    if (tag.startsWith("#")) {
      tag = tag.substring(1);
    }
    tag = tag.replaceAll("[^a-z0-9 _-]", "");
    tag = tag.replaceAll("\\s+", "-");
    return tag;
  }
}

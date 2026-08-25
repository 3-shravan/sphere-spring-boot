package com.sphere.ai.ai.provider;

import org.springframework.util.MimeType;

/**
 * Provider-agnostic AI interface.
 *
 * Feature #1 implemented: Image Caption Generation.
 * Future features are pluggable by adding new methods — zero changes to
 
 * Every AI provider (OpenAI, Gemini, Anthropic, …) must implement this
 * interface. Services depend on this abstraction, never on a concrete
 * provider class. Adding a new provider in the future requires only:
 * 1. A new implementation of this interface.
 * 2. A Spring qualifier / conditional bean.
 * 3. Zero changes to any service or controller.
 */
public interface AiProvider {

  /**
   * Analyses an image at a publicly accessible URL with the given prompt.
   *
   * @param imageUrl Publicly accessible URL (http/https).
   * @param prompt   Instruction to send alongside the image.
   * @return Plain-text response from the model.
   */
  String analyzeImage(String imageUrl, String prompt);

  /**
   * Analyses raw image bytes (e.g. from a multipart file upload) with the
   * given prompt. No caching is applied — suited for on-the-fly generation.
   *
   * @param bytes    Raw image bytes.
   * @param mimeType MIME type of the image (e.g. image/jpeg).
   * @param prompt   Instruction to send alongside the image.
   * @return Plain-text response from the model.
   */
  String analyzeImageBytes(byte[] bytes, MimeType mimeType, String prompt);

  /**
   * Sends a plain-text prompt and returns the response.
   * Reserved for future text-only features (jokes, facts, sentiment, …).
   *
   * @param prompt Instruction to send to the model.
   * @return Plain-text response from the model.
   */
  String generate(String prompt);

  /** Human-readable provider name, e.g. {@code "openai"}. Stored for audit. */
  String providerName();

  /** Active model version, e.g. {@code "gpt-4o"}. Stored for audit. */
  String modelVersion();
}

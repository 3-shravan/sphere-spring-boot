package com.sphere.ai.ai.provider;

import java.net.MalformedURLException;
import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;

import com.sphere.ai.exception.AiProviderException;

/**
 * OpenAI implementation of {@link AiProvider}.
 *
 * Configured via {@code spring.ai.openai.*} properties (auto-configured by
 * the spring-ai-openai-spring-boot-starter). Points to the Capgemini OpenAI
 * gateway configured in application.yml.
 *
 * Feature #1: Image Caption Generation (URL-based and file/bytes-based).
 * Future features: add new methods to the interface and implement here.
 * Adding a second provider (Gemini, Anthropic) means a new class only.
 */
@Component
public class OpenAiProvider implements AiProvider {

  private static final Logger log = LoggerFactory.getLogger(OpenAiProvider.class);

  private final ChatClient chatClient;

  @Value("${spring.ai.openai.chat.options.model:gpt-4o}")
  private String model;

  public OpenAiProvider(ChatModel chatModel) {
    this.chatClient = ChatClient.create(chatModel);
  }

  // ------------------------------------------------------------------
  // Feature #1 — Image Caption (URL-based vision)
  // ------------------------------------------------------------------

  @Override
  public String analyzeImage(String imageUrl, String prompt) {
    log.debug("analyzeImage model={} url={}", model, imageUrl);
    try {
      MimeType mimeType = detectMimeType(imageUrl);
      String response = chatClient.prompt()
          .user(u -> {
            try {
              u.text(prompt).media(mimeType, URI.create(imageUrl).toURL());
            } catch (MalformedURLException e) {
              throw new AiProviderException("Invalid image URL: " + imageUrl);
            }
          })
          .call()
          .content();
      log.debug("analyzeImage complete model={}", model);
      return response;
    } catch (AiProviderException e) {
      throw e;
    } catch (Exception e) {
      log.error("analyzeImage failed model={} error={}", model, e.getMessage(), e);
      throw new AiProviderException("OpenAI image analysis failed: " + e.getMessage());
    }
  }

  // ------------------------------------------------------------------
  // Feature #1 — Image Caption (bytes/file-based vision)
  // ------------------------------------------------------------------

  @Override
  public String analyzeImageBytes(byte[] bytes, MimeType mimeType, String prompt) {
    log.debug("analyzeImageBytes model={} bytes={}", model, bytes.length);
    try {
      Resource resource = new ByteArrayResource(bytes) {
          @Override
          public String getFilename() {
              return "upload.jpg"; // Provide a filename to avoid 400 Bad Request from gateways/converters
          }
      };
      String response = chatClient.prompt()
          .user(u -> u.text(prompt).media(mimeType, resource))
          .call()
          .content();
      log.debug("analyzeImageBytes complete model={}", model);
      return response;
    } catch (Exception e) {
      log.error("analyzeImageBytes failed model={} error={}", model, e.getMessage(), e);
      throw new AiProviderException("OpenAI image analysis failed: " + e.getMessage());
    }
  }

  // ------------------------------------------------------------------
  // Text generation — reserved for future features (jokes, facts, …)
  // ------------------------------------------------------------------

  @Override
  public String generate(String prompt) {
    log.debug("generate model={}", model);
    try {
      return chatClient.prompt().user(prompt).call().content();
    } catch (Exception e) {
      log.error("generate failed model={} error={}", model, e.getMessage(), e);
      throw new AiProviderException("OpenAI text generation failed: " + e.getMessage());
    }
  }

  @Override
  public String providerName() {
    return "openai";
  }

  @Override
  public String modelVersion() {
    return model;
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  /**
   * Infers MIME type from URL. Defaults to JPEG (Cloudinary URLs often omit
   * extension).
   */
  private MimeType detectMimeType(String imageUrl) {
    String lower = imageUrl.toLowerCase();
    if (lower.contains(".png"))
      return MimeTypeUtils.IMAGE_PNG;
    if (lower.contains(".gif"))
      return MimeTypeUtils.IMAGE_GIF;
    if (lower.contains(".webp"))
      return MimeType.valueOf("image/webp");
    return MimeTypeUtils.IMAGE_JPEG;
  }
}


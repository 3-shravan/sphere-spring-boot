package com.sphere.ai.ai.prompt;

import org.springframework.stereotype.Service;

/**
 * Central repository for all AI prompts.
 *
 * <strong>Rule:</strong> prompts must NEVER be hardcoded in controllers,
 * services, or provider classes. All prompts live here.
 *
 * Adding a new AI feature = adding a new method here. Existing methods
 * are never modified (Open/Closed Principle).
 */
@Service
public class PromptService {

  // -----------------------------------------------------------------------
  // Feature #1 — Image Caption Generation (IMPLEMENTED)
  // -----------------------------------------------------------------------

  /**
   * Returns the prompt used to generate a short, engaging social-media
   * caption from an image.
   */
  public String imageCaptionPrompt() {
    return """
        You are a creative social media writer for the Sphere platform.
        Look at the provided image and write a single, short, engaging caption \
        suitable for a social media post.
        Requirements:
        - Maximum 150 characters.
        - Do not include hashtags.
        - Do not include quotation marks.
        - Write in English.
        - Match the mood and content of the image.
        - Output ONLY the caption text, nothing else.
        """;
  }

  /**
   * Returns the prompt used to generate concise social-media tags from an
   * image.
   */
  public String imageTagsPrompt() {
    return """
        You are a social media tagging assistant for the Sphere platform.
        Analyze the provided image and generate relevant tags.
        Requirements:
        - Return 5 to 10 tags.
        - Tags must be lowercase.
        - Do not include the # symbol.
        - Prefer short tags (1-2 words max).
        - Avoid duplicates and generic filler tags.
        - Output STRICT JSON array only, e.g. [\"sunset\",\"travel\",\"beach\"].
        """;
  }

  // -----------------------------------------------------------------------
  // Future feature placeholders — implement the method body when ready.
  // -----------------------------------------------------------------------

  /**
   * Placeholder: returns a prompt for generating a short interesting joke.
   * Future feature — not yet hooked into a controller.
   */
  public String jokePrompt() {
    return """
        Generate a single, short, family-friendly joke.
        Output ONLY the joke text, nothing else.
        """;
  }

  /**
   * Placeholder: returns a prompt for generating an interesting fun fact.
   * Future feature — not yet hooked into a controller.
   */
  public String funFactPrompt() {
    return """
        Generate a single interesting and surprising fun fact.
        Output ONLY the fact text, nothing else.
        """;
  }

  /**
   * Placeholder: returns a prompt for content moderation.
   * Future feature — not yet hooked into a controller.
   */
  public String contentModerationPrompt() {
    return """
        Analyse the provided image for inappropriate, harmful, or NSFW content.
        Respond with exactly one of: SAFE, NSFW, or HARMFUL
        followed by a pipe character and a brief one-sentence reason.
        Output ONLY the verdict and reason, nothing else.
        """;
  }
}

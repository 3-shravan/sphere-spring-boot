package com.sphere.ai.ai.prompt;

import org.springframework.stereotype.Service;

/**
 * Central repository for all AI prompts.
 * 
 * Adding a new AI feature = adding a new method here. Existing methods
 * are never modified (Open/Closed Principle).
 */
@Service
public class PromptService {

  /**
   * Feature #1 — Image Caption Generation (IMPLEMENTED)
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

  /**
   * Prompt for expanding a user search phrase into semantic keywords.
   */
  public String semanticQueryExpansionPrompt(String query) {
    return """
        You are a semantic search query expander for a social media app.
        Given the user query, return conceptually related search terms.

        User query: "%s"

        Rules:
        - Return STRICT JSON object only.
        - JSON format: {"normalizedQuery":"...","terms":["term1","term2",...]}.
        - Include 6 to 12 short terms.
        - Terms should represent meaning-based variants and related concepts.
        - Lowercase terms only.
        - No duplicates.
        - No explanation text.
        """.formatted(query);
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

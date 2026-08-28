package com.sphere.ai.controller;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sphere.ai.ai.prompt.PromptService;
import com.sphere.ai.ai.provider.AiProvider;
import com.sphere.ai.util.ResponseUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Placeholder controller for future miscellaneous AI features.
 *
 * Features scaffolded (not yet implemented — will call PromptService
 * and AiProvider when activated):
 * - GET /api/v1/ai/misc/joke → one-line interesting joke
 * - GET /api/v1/ai/misc/fact → interesting fun fact
 *
 * To activate a feature: inject ImageAnalysisService (or a dedicated
 * MiscAiService), call promptService.jokePrompt() / funFactPrompt(),
 * and replace the placeholder response below.
 */
@RestController
@RequestMapping("/api/v1/ai/misc")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "AI Misc", description = "Placeholder for future miscellaneous AI features (jokes, facts, …)")
public class MiscAiController {

  private final PromptService promptService;
  private final AiProvider aiProvider;
  private final ObjectMapper objectMapper = new ObjectMapper();

  // ------------------------------------------------------------------
  // Future Feature — Interesting Joke
  // ------------------------------------------------------------------

  @Operation(summary = "[COMING SOON] Generate a one-line joke", description = "Placeholder. Will return an AI-generated one-liner joke when activated.")
  @GetMapping("/joke")
  public ResponseEntity<Map<String, Object>> getJoke(
      @AuthenticationPrincipal Long currentUserId) {

    // TODO: inject AiProvider + PromptService, call
    // aiProvider.generate(promptService.jokePrompt())
    return ResponseEntity.ok(ResponseUtil.success("Feature coming soon!",
        Map.of("joke", "Why do programmers prefer dark mode? Because light attracts bugs! 🐛")));
  }

  // ------------------------------------------------------------------
  // Future Feature — Interesting Fact
  // ------------------------------------------------------------------

  @Operation(summary = "[COMING SOON] Generate an interesting fact", description = "Placeholder. Will return an AI-generated fun fact when activated.")
  @GetMapping("/fact")
  public ResponseEntity<Map<String, Object>> getFact(
      @AuthenticationPrincipal Long currentUserId) {

    // TODO: inject AiProvider + PromptService, call
    // aiProvider.generate(promptService.funFactPrompt())
    return ResponseEntity.ok(ResponseUtil.success("Feature coming soon!",
        Map.of("fact",
            "Honey never spoils — archaeologists have found 3000-year-old edible honey in Egyptian tombs. 🍯")));
  }

  @Operation(summary = "Expand search query semantically", description = "Returns normalized query and related semantic terms for meaning-based post search.")
  @GetMapping("/semantic-query")
  public ResponseEntity<Map<String, Object>> expandSemanticQuery(
      @RequestParam("query") String query,
      @AuthenticationPrincipal Long currentUserId) {

    String cleaned = query == null ? "" : query.trim();
    if (cleaned.isEmpty()) {
      return ResponseEntity.ok(ResponseUtil.success("No query provided",
          Map.of("normalizedQuery", "", "terms", List.of())));
    }

    try {
      String prompt = promptService.semanticQueryExpansionPrompt(cleaned);
      String raw = aiProvider.generate(prompt);
      Map<String, Object> parsed = objectMapper.readValue(raw, new TypeReference<Map<String, Object>>() {
      });

      String normalized = normalizeTerm((String) parsed.getOrDefault("normalizedQuery", cleaned));
      List<String> terms = sanitizeTerms(parsed.get("terms"));

      if (terms.isEmpty()) {
        terms = tokenizeFallback(cleaned);
      }

      return ResponseEntity.ok(ResponseUtil.success("Semantic query expanded successfully",
          Map.of("normalizedQuery", normalized, "terms", terms)));
    } catch (Exception e) {
      List<String> fallbackTerms = tokenizeFallback(cleaned);
      return ResponseEntity.ok(ResponseUtil.success("Semantic query expansion fallback",
          Map.of("normalizedQuery", normalizeTerm(cleaned), "terms", fallbackTerms)));
    }
  }

  private List<String> sanitizeTerms(Object rawTerms) {
    if (!(rawTerms instanceof List<?> list)) {
      return List.of();
    }

    Set<String> set = new LinkedHashSet<>();
    for (Object item : list) {
      if (!(item instanceof String text)) {
        continue;
      }
      String term = normalizeTerm(text);
      if (!term.isBlank()) {
        set.add(term);
      }
      if (set.size() >= 12) {
        break;
      }
    }
    return List.copyOf(set);
  }

  private List<String> tokenizeFallback(String query) {
    String[] tokens = query.toLowerCase(Locale.ROOT).split("\\s+");
    Set<String> set = new LinkedHashSet<>();
    for (String token : tokens) {
      String term = normalizeTerm(token);
      if (!term.isBlank()) {
        set.add(term);
      }
      if (set.size() >= 8) {
        break;
      }
    }
    return new ArrayList<>(set);
  }

  private String normalizeTerm(String value) {
    if (value == null) {
      return "";
    }
    String normalized = value.toLowerCase(Locale.ROOT).trim();
    normalized = normalized.replace("#", "");
    normalized = normalized.replaceAll("[^a-z0-9 _-]", "");
    normalized = normalized.replaceAll("\\s+", " ");
    return normalized;
  }
}

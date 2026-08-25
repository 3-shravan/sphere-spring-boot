package com.sphere.ai.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

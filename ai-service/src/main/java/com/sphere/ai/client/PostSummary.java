package com.sphere.ai.client;

/**
 * Minimal post summary — used to verify a post exists before running
 * (optionally) expensive AI analysis.
 */
public record PostSummary(
    Long id,
    String mediaUrl,
    Long authorId) {
}

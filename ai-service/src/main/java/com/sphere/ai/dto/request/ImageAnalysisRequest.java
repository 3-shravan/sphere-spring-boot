package com.sphere.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request body for {@code POST /api/v1/ai/caption} (URL-based caption
 * generation).
 * For file-based caption generation use the multipart endpoint instead.
 */
public record ImageAnalysisRequest(

    @NotBlank(message = "imageUrl is required") @Size(max = 2000, message = "imageUrl must not exceed 2000 characters") @Pattern(regexp = "^https?://.*", message = "imageUrl must be a valid http/https URL") String imageUrl) {
}

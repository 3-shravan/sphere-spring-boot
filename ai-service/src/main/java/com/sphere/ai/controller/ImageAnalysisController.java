package com.sphere.ai.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sphere.ai.dto.request.ImageAnalysisRequest;
import com.sphere.ai.dto.response.ImageAnalysisResponse;
import com.sphere.ai.exception.BadRequestException;
import com.sphere.ai.service.ImageAnalysisService;
import com.sphere.ai.util.ResponseUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Feature #1 — Image Caption Generation endpoints.
 *
 * POST /api/v1/ai/caption — Generate caption from a public image URL (cached)
 * POST /api/v1/ai/caption/upload — Generate caption by uploading an image file
 * (not cached)
 * GET /api/v1/ai/caption — Retrieve cached caption for a public image URL
 *
 * All endpoints require a valid JWT.
 */
@RestController
@RequestMapping("/api/v1/ai/caption")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "AI Caption", description = "AI-powered image caption generation (Feature #1)")
public class ImageAnalysisController {

  private final ImageAnalysisService imageAnalysisService;

  // ------------------------------------------------------------------
  // POST /api/v1/ai/caption — URL-based, cached
  // ------------------------------------------------------------------

  @Operation(summary = "Generate caption from image URL", description = "Generates a short, engaging caption for the image at the provided URL. Results are cached by imageUrl — repeated requests return instantly.", responses = {
      @ApiResponse(responseCode = "200", description = "Caption generated or retrieved from cache"),
      @ApiResponse(responseCode = "400", description = "Invalid request"),
      @ApiResponse(responseCode = "401", description = "Not authenticated"),
      @ApiResponse(responseCode = "502", description = "AI provider error")
  })
  @PostMapping
  public ResponseEntity<Map<String, Object>> generateCaption(
      @Valid @RequestBody ImageAnalysisRequest request,
      @AuthenticationPrincipal Long currentUserId) {

    ImageAnalysisResponse response = imageAnalysisService.generateCaption(request.imageUrl());
    String message = response.cached() ? "Caption retrieved from cache" : "Caption generated successfully";
    return ResponseEntity.ok(ResponseUtil.success(message,
        Map.of("caption", response.caption(), "cached", response.cached())));
  }

  // ------------------------------------------------------------------
  // POST /api/v1/ai/caption/upload — file upload, not cached
  // ------------------------------------------------------------------

  @Operation(summary = "Generate caption from uploaded image file", description = "Accepts a multipart image file and returns an AI-generated caption. Used by the frontend 'Generate Caption' button during post creation (before the post has a Cloudinary URL).", responses = {
      @ApiResponse(responseCode = "200", description = "Caption generated"),
      @ApiResponse(responseCode = "400", description = "No file or unsupported type"),
      @ApiResponse(responseCode = "401", description = "Not authenticated"),
      @ApiResponse(responseCode = "502", description = "AI provider error")
  })
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, Object>> generateCaptionFromUpload(
      @RequestPart("image") MultipartFile image,
      @AuthenticationPrincipal Long currentUserId) {

    if (image == null || image.isEmpty()) {
      throw new BadRequestException("Image file is required");
    }
    String contentType = image.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new BadRequestException("Only image files are supported");
    }
    byte[] bytes;
    try {
      bytes = image.getBytes();
    } catch (Exception e) {
      throw new BadRequestException("Failed to read image file");
    }
    ImageAnalysisResponse response = imageAnalysisService.generateCaptionFromBytes(bytes, contentType);
    return ResponseEntity.ok(ResponseUtil.success("Caption generated successfully",
        Map.of("caption", response.caption(), "cached", false)));
  }

  // ------------------------------------------------------------------
  // GET /api/v1/ai/caption?imageUrl=... — retrieve cached caption
  // ------------------------------------------------------------------

  @Operation(summary = "Get (or generate) caption for an image URL", description = "Returns the cached caption for an image URL. If not cached, generates one now.", responses = {
      @ApiResponse(responseCode = "200", description = "Caption returned"),
      @ApiResponse(responseCode = "401", description = "Not authenticated")
  })
  @GetMapping
  public ResponseEntity<Map<String, Object>> getCachedCaption(
      @RequestParam String imageUrl,
      @AuthenticationPrincipal Long currentUserId) {

    ImageAnalysisResponse response = imageAnalysisService.generateCaption(imageUrl);
    String message = response.cached() ? "Caption retrieved from cache" : "Caption generated successfully";
    return ResponseEntity.ok(ResponseUtil.success(message,
        Map.of("caption", response.caption(), "cached", response.cached())));
  }
}

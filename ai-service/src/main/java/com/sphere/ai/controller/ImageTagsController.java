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
import com.sphere.ai.dto.response.ImageTagsResponse;
import com.sphere.ai.exception.BadRequestException;
import com.sphere.ai.service.ImageAnalysisService;
import com.sphere.ai.util.ResponseUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/ai/tags")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "AI Tags", description = "AI-powered image tags generation")
public class ImageTagsController {

  private final ImageAnalysisService imageAnalysisService;

  @Operation(summary = "Generate tags from image URL", description = "Generates relevant tags for the image at the provided URL. Results are cached by imageUrl.", responses = {
      @ApiResponse(responseCode = "200", description = "Tags generated or retrieved from cache"),
      @ApiResponse(responseCode = "400", description = "Invalid request"),
      @ApiResponse(responseCode = "401", description = "Not authenticated"),
      @ApiResponse(responseCode = "502", description = "AI provider error")
  })
  @PostMapping
  public ResponseEntity<Map<String, Object>> generateTags(
      @Valid @RequestBody ImageAnalysisRequest request,
      @AuthenticationPrincipal Long currentUserId) {

    ImageTagsResponse response = imageAnalysisService.generateTags(request.imageUrl());
    String message = response.cached() ? "Tags retrieved from cache" : "Tags generated successfully";
    return ResponseEntity.ok(ResponseUtil.success(message,
        Map.of("tags", response.tags(), "cached", response.cached())));
  }

  @Operation(summary = "Generate tags from uploaded image file", description = "Accepts a multipart image file and returns AI-generated tags.", responses = {
      @ApiResponse(responseCode = "200", description = "Tags generated"),
      @ApiResponse(responseCode = "400", description = "No file or unsupported type"),
      @ApiResponse(responseCode = "401", description = "Not authenticated"),
      @ApiResponse(responseCode = "502", description = "AI provider error")
  })
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, Object>> generateTagsFromUpload(
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

    ImageTagsResponse response = imageAnalysisService.generateTagsFromBytes(bytes, contentType);
    return ResponseEntity.ok(ResponseUtil.success("Tags generated successfully",
        Map.of("tags", response.tags(), "cached", false)));
  }

  @Operation(summary = "Get (or generate) tags for an image URL", description = "Returns cached tags for an image URL. If not cached, generates them now.", responses = {
      @ApiResponse(responseCode = "200", description = "Tags returned"),
      @ApiResponse(responseCode = "401", description = "Not authenticated")
  })
  @GetMapping
  public ResponseEntity<Map<String, Object>> getTags(
      @RequestParam String imageUrl,
      @AuthenticationPrincipal Long currentUserId) {

    ImageTagsResponse response = imageAnalysisService.generateTags(imageUrl);
    String message = response.cached() ? "Tags retrieved from cache" : "Tags generated successfully";
    return ResponseEntity.ok(ResponseUtil.success(message,
        Map.of("tags", response.tags(), "cached", response.cached())));
  }
}

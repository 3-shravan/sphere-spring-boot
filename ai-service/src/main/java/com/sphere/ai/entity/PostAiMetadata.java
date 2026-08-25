package com.sphere.ai.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Stores AI-generated captions, keyed by image URL.
 * One row per unique imageUrl — prevents repeated OpenAI calls for the same
 * image.
 *
 * Extended later for description, hashtags, tags, moderation etc. by adding
 * columns and a new Flyway migration — no changes to existing code required.
 */
@Entity
@Table(name = "post_ai_metadata")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostAiMetadata {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** Cache key — unique per image URL. */
  @Column(name = "image_url", nullable = false, unique = true, columnDefinition = "TEXT")
  private String imageUrl;

  /** AI-generated short caption (≤150 chars). */
  @Column(name = "caption", length = 500)
  private String caption;

  @Column(name = "ai_provider", nullable = false, length = 50)
  @Builder.Default
  private String aiProvider = "openai";

  @Column(name = "model_version", length = 100)
  private String modelVersion;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}

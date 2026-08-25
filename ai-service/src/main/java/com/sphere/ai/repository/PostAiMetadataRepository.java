package com.sphere.ai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sphere.ai.entity.PostAiMetadata;

@Repository
public interface PostAiMetadataRepository extends JpaRepository<PostAiMetadata, Long> {

  /** Look up a cached caption by the image URL that was analysed. */
  Optional<PostAiMetadata> findByImageUrl(String imageUrl);

  boolean existsByImageUrl(String imageUrl);
}

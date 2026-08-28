package com.sphere.post.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.post.entity.SavedPost;
import com.sphere.post.entity.SavedPostId;

public interface SavedPostRepository extends JpaRepository<SavedPost, SavedPostId> {

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    @Modifying
    @Query("DELETE FROM SavedPost s WHERE s.userId = :userId AND s.postId = :postId")
    void deleteByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);

    // Dedicated paginated saved posts (bookmarks) for a user
    Page<SavedPost> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT s.postId FROM SavedPost s WHERE s.userId = :userId ORDER BY s.createdAt DESC")
    List<Long> findPostIdsByUserId(@Param("userId") Long userId);

    // Batch query to check which posts are saved by the current user (eliminates N+1)
    @Query("SELECT s.postId FROM SavedPost s WHERE s.userId = :userId AND s.postId IN :postIds")
    Set<Long> findSavedPostIdsByUserId(@Param("userId") Long userId, @Param("postIds") List<Long> postIds);
}

package com.sphere.post.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.post.dto.response.PostCountProjection;
import com.sphere.post.entity.PostLike;
import com.sphere.post.entity.PostLikeId;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {

    boolean existsByPostIdAndUserId(Long postId, Long userId);

    long countByPostId(Long postId);

    @Modifying
    @Query("DELETE FROM PostLike l WHERE l.postId = :postId AND l.userId = :userId")
    void deleteByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);

    // Dedicated paginated likes listing for a specific post
    Page<PostLike> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    // Batch query to aggregate like counts for multiple posts (eliminates N+1)
    @Query("SELECT l.postId AS postId, COUNT(l) AS count FROM PostLike l WHERE l.postId IN :postIds GROUP BY l.postId")
    List<PostCountProjection> countLikesByPostIds(@Param("postIds") List<Long> postIds);

    // Batch query to check which posts are liked by the current user (eliminates N+1)
    @Query("SELECT l.postId FROM PostLike l WHERE l.userId = :userId AND l.postId IN :postIds")
    Set<Long> findLikedPostIdsByUserId(@Param("userId") Long userId, @Param("postIds") List<Long> postIds);
}

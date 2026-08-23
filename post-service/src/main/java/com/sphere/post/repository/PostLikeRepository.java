package com.sphere.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.post.entity.PostLike;
import com.sphere.post.entity.PostLikeId;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {

    boolean existsByPostIdAndUserId(Long postId, Long userId);

    long countByPostId(Long postId);

    @Modifying
    @Query("DELETE FROM PostLike l WHERE l.postId = :postId AND l.userId = :userId")
    void deleteByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);
}

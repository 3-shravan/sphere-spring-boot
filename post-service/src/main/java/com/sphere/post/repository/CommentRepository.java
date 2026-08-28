package com.sphere.post.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.post.dto.response.PostCountProjection;
import com.sphere.post.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

    long countByPostId(Long postId);

    // Batch query to aggregate comment counts for multiple posts (eliminates N+1)
    @Query("SELECT c.postId AS postId, COUNT(c) AS count FROM Comment c WHERE c.postId IN :postIds GROUP BY c.postId")
    List<PostCountProjection> countCommentsByPostIds(@Param("postIds") List<Long> postIds);
}

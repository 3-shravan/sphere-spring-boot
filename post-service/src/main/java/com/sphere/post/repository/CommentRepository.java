package com.sphere.post.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sphere.post.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

    long countByPostId(Long postId);
}

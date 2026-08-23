package com.sphere.post.repository;

import java.util.List;

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

    @Query("SELECT s.postId FROM SavedPost s WHERE s.userId = :userId ORDER BY s.createdAt DESC")
    List<Long> findPostIdsByUserId(@Param("userId") Long userId);
}

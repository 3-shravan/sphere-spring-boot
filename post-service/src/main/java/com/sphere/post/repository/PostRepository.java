package com.sphere.post.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sphere.post.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.authorId NOT IN :excludedAuthorIds ORDER BY p.createdAt DESC")
    Page<Post> findGlobalFeed(@Param("excludedAuthorIds") List<Long> excludedAuthorIds, Pageable pageable);

    @Query("""
            SELECT p FROM Post p
            WHERE p.authorId IN :scopeAuthorIds AND p.authorId NOT IN :excludedAuthorIds
            ORDER BY p.createdAt DESC
            """)
    Page<Post> findFollowingFeed(@Param("scopeAuthorIds") List<Long> scopeAuthorIds,
                                  @Param("excludedAuthorIds") List<Long> excludedAuthorIds, Pageable pageable);

    Page<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    long countByAuthorId(Long authorId);
}

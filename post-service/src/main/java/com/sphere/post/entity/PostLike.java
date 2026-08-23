package com.sphere.post.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Replaces Post.likes[] with a normalized join table (composite PK, atomic toggle, indexed). */
@Entity
@Table(name = "post_likes")
@IdClass(PostLikeId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostLike {

    @Id
    @Column(name = "post_id")
    private Long postId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

package com.sphere.post.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Replaces the User.saved[] array from the Node source (now living on the post-service side, since "saved" is fundamentally a post-domain relationship once posts and users are split). */
@Entity
@Table(name = "saved_posts")
@IdClass(SavedPostId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavedPost {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "post_id")
    private Long postId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

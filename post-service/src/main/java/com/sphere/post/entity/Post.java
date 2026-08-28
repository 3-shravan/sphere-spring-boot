package com.sphere.post.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ports server/src/models/feed/post.model.js.
 *
 * Deviations from source (documented, not silent):
 *  - likes[] array -> normalized `post_likes` join table (PostLike entity),
 *    per master prompt §5/§24 — same reasoning as user_follows.
 *  - comments[] array -> comments simply have a `post_id` FK; no array to
 *    maintain on the Post side at all.
 *  - author is NOT a JPA relationship (no cross-service FK) — author_id is
 *    a plain Long, and author_name/author_profile_picture are a denormalized
 *    snapshot fetched via Feign from user-service at creation time. This is
 *    an accepted microservices tradeoff (the display name/picture on old
 *    posts won't reflect a later profile-name change) — flagged for
 *    docs/decisions/DECISIONS_REQUIRED.md as a new item, not decided silently
 *    to be "definitely fine forever."
 */
@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    // Denormalized author snapshot — see class javadoc.
    @Column(name = "author_name", nullable = false, length = 20)
    private String authorName;

    @Column(name = "author_profile_picture")
    private String authorProfilePicture;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_type", nullable = false, length = 10)
    @Builder.Default
    private PostType postType = PostType.media;

    @Column(name = "thoughts", length = 5000)
    private String thoughts;

    @Column(name = "caption", length = 500)
    private String caption;

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(name = "media_public_id")
    private String mediaPublicId;

    @Column(name = "location", length = 100)
    private String location;

    // Postgres native text[] — avoids a separate join table for a small,
    // unindexed, order-preserving string list (source caps at 50 tags).
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tags")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

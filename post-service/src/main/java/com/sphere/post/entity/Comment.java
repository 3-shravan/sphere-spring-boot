package com.sphere.post.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ports server/src/models/feed/comment.model.js.
 *
 * Deviations (documented): parentComment is a real self-referencing FK
 * (parent_comment_id) with ON DELETE CASCADE — this naturally fixes the
 * source's orphan-replies bug (Decision #6: deleting a reply now correctly
 * cascades via the DB, and deleting a top-level comment correctly removes
 * its whole reply subtree via CASCADE instead of the source's manual
 * recursive-delete-then-forgot-to-update-parent approach). The source's
 * `replies: [{ ref: "Comment" }]` array (with its own typo, `red` instead
 * of `ref`) and the always-empty `likedBy[]` field are both dropped —
 * replies are just comments with a non-null parent_comment_id, and
 * likedBy[] was dead code in the source (no controller ever wrote to it).
 */
@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "author_name", nullable = false, length = 20)
    private String authorName;

    @Column(name = "author_profile_picture")
    private String authorProfilePicture;

    @Column(name = "comment", nullable = false, length = 500)
    private String comment;

    @Column(name = "parent_comment_id")
    private Long parentCommentId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

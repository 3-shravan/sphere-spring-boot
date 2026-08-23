package com.sphere.user.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.IdClass;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Replaces the Mongo User.followers[]/following[] arrays with a normalized
 * join table (docs/02-target-architecture.md). One row = one directed
 * "follower_id follows followee_id" edge, atomic via the composite primary
 * key (no more non-atomic two-step $push/$pull on two separate documents
 * like the source did).
 */
@Entity
@Table(name = "user_follows")
@IdClass(UserFollowId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFollow {

    @Id
    @Column(name = "follower_id")
    private Long followerId;

    @Id
    @Column(name = "followee_id")
    private Long followeeId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

package com.sphere.user.entity;

import java.time.Instant;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ports server/src/models/user/user.model.js.
 *
 * Deliberate deviations from the Mongo source (all documented in
 * docs/02-target-architecture.md and docs/decisions/DECISIONS_REQUIRED.md,
 * none silent):
 *  - followers[]/following[]/posts[]/saved[] arrays are REMOVED. Follows are
 *    a normalized join table (UserFollow). posts[]/saved[] belong to
 *    post-service once it exists, not here.
 *  - verificationCode / resetPassword OTP are still stored as plaintext-ish
 *    strings, matching source behavior (Decision: not hardened yet).
 *  - resetPasswordToken is stored as a SHA-256 hash, exactly as the source
 *    already does.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", length = 20, nullable = false)
    private String username;

    @Column(name = "full_name", length = 50)
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "profile_picture_public_id")
    private String profilePicturePublicId;

    @Column(name = "bio", length = 220)
    @Builder.Default
    private String bio = "";

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private Gender gender;

    @Column(name = "account_verified", nullable = false)
    @Builder.Default
    private boolean accountVerified = false;

    @Column(name = "attempts", nullable = false)
    @Builder.Default
    private int attempts = 0;

    @Column(name = "last_attempt_at")
    private Instant lastAttemptAt;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_code_expires_at")
    private Instant verificationCodeExpiresAt;

    @Column(name = "reset_password_token_hash")
    private String resetPasswordTokenHash;

    @Column(name = "reset_password_token_expires_at")
    private Instant resetPasswordTokenExpiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

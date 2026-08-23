package com.sphere.notification.dto;

import java.time.Instant;

import jakarta.validation.constraints.NotNull;

/**
 * Wire shape for POST /internal/notifications, published by user-service
 * (follow) and post-service (like/comment/reply) via their respective
 * NotificationPublisher classes.
 */
public record NotificationEvent(
        @NotNull NotificationType type,
        @NotNull Long targetUserId,
        @NotNull Long actorId,
        @NotNull String actorName,
        String actorProfilePicture,
        Long postId,
        Long commentId,
        Instant occurredAt
) {
}

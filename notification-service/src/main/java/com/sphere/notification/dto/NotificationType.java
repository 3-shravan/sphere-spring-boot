package com.sphere.notification.dto;

/** Mirrors the four notification "type" values the source's sockets/emitters/notifications.emit.js sends: follow, like, comment, reply. */
public enum NotificationType {
    FOLLOW, LIKE, COMMENT, REPLY
}

package com.sphere.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Ports sockets/emitters/notifications.emit.js#sendNotification's CALL
 * SITES (follow events) — but NOT its transport. The source delivers
 * directly over a Socket.IO connection to the target user if online.
 *
 * Per docs/decisions/DECISIONS_REQUIRED.md #1/#2, the real-time transport
 * (WebSocket/STOMP channel + presence registry) is deferred to a dedicated
 * notification-service, since it's shared infrastructure that also touched
 * the excluded chat feature in the source. This class is a seam: it logs
 * the notification event for now so follow logic isn't blocked on that
 * decision, and gives notification-service a single call site to wire a
 * real transport into later (e.g. publish to a queue / call a REST hook)
 * without touching user-service's business logic again.
 */
@Service
public class NotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(NotificationPublisher.class);

    public void publishFollowNotification(Long targetUserId, Long followerUserId, String followerName, String followerProfilePicture) {
        // TODO(notification-service): replace with a real publish call once
        // Decision #1/#2 are resolved. Intentionally not a no-op silently —
        // logged so the gap is visible in ops, not swallowed.
        log.info("[notification:follow] target={} follower={} ({})", targetUserId, followerUserId, followerName);
    }
}

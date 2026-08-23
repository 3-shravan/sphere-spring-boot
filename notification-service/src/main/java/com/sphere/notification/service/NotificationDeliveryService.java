package com.sphere.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.sphere.notification.dto.NotificationEvent;

import lombok.RequiredArgsConstructor;

/**
 * Ports sockets/emitters/notifications.emit.js#sendNotification's delivery
 * semantics exactly: best-effort, real-time-only, no persistence, no error
 * if the target user isn't currently connected (Spring's user-destination
 * routing simply delivers to nobody in that case — same as the source's
 * onlineUsers registry lookup returning nothing for an offline user).
 */
@Service
@RequiredArgsConstructor
public class NotificationDeliveryService {

    private static final Logger log = LoggerFactory.getLogger(NotificationDeliveryService.class);
    private static final String DESTINATION = "/queue/notifications";

    private final SimpMessagingTemplate messagingTemplate;

    public void deliver(NotificationEvent event) {
        messagingTemplate.convertAndSendToUser(event.targetUserId().toString(), DESTINATION, event);
        log.debug("Delivered {} notification to user {} (best-effort — no-op if offline)",
                event.type(), event.targetUserId());
    }
}

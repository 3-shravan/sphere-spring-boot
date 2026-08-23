package com.sphere.post.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** Ports the like/comment/reply notification call sites — see user-service's NotificationPublisher javadoc for the deferred-transport rationale (Decision #1/#2). */
@Service
public class NotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(NotificationPublisher.class);

    public void publishLikeNotification(Long targetUserId, Long likerUserId, String likerName) {
        log.info("[notification:like] target={} liker={} ({})", targetUserId, likerUserId, likerName);
    }

    public void publishCommentNotification(Long targetUserId, Long commenterUserId, String commenterName) {
        log.info("[notification:comment] target={} commenter={} ({})", targetUserId, commenterUserId, commenterName);
    }

    public void publishReplyNotification(Long targetUserId, Long replierUserId, String replierName) {
        log.info("[notification:reply] target={} replier={} ({})", targetUserId, replierUserId, replierName);
    }
}

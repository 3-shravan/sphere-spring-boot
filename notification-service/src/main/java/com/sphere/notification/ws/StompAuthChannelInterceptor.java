package com.sphere.notification.ws;

import org.jspecify.annotations.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import com.sphere.notification.security.JwtService;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;

/**
 * Ports the identity half of authUser.js for the WebSocket world: a plain
 * WebSocket/SockJS handshake has no natural place for an Authorization
 * header the way an HTTP request does, so the JWT travels as a STOMP
 * CONNECT frame header instead (`Authorization: Bearer <token>`), and this
 * interceptor validates it exactly once, at CONNECT time, rather than per
 * message.
 *
 * The resulting Principal's name is the numeric user id as a string — this
 * is what makes `SimpMessagingTemplate.convertAndSendToUser(userId, ...)`
 * (in NotificationDeliveryService) reach the right session, mirroring the
 * source's per-user Socket.IO room keyed by user id
 * (sockets/utils/onlineUsers.js).
 *
 * A connection with a missing/invalid/expired token is rejected outright
 * (the STOMP session never completes CONNECT) — there is no anonymous/guest
 * notification stream, unlike post-service's grantUnknownAccess pattern for
 * single-post viewing; notifications are inherently per-identified-user.
 */
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = firstNativeHeader(accessor, "Authorization");
            String token = extractBearerToken(authHeader);

            if (token == null) {
                throw new IllegalArgumentException("Missing bearer token on STOMP CONNECT");
            }

            try {
                Long userId = jwtService.parseUserId(token);
                accessor.setUser(new StompPrincipal(userId.toString()));
            } catch (JwtException e) {
                throw new IllegalArgumentException("Invalid or expired token on STOMP CONNECT", e);
            }
        }

        return message;
    }

    private String firstNativeHeader(StompHeaderAccessor accessor, String name) {
        var values = accessor.getNativeHeader(name);
        return (values == null || values.isEmpty()) ? null : values.get(0);
    }

    private String extractBearerToken(String header) {
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}

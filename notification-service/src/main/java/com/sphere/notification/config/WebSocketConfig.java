package com.sphere.notification.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.sphere.notification.ws.StompAuthChannelInterceptor;

import lombok.RequiredArgsConstructor;

/**
 * Replaces the source's Socket.IO setup (sockets/socket.js) with Spring's
 * STOMP-over-WebSocket support.
 *
 * Endpoint: /ws (SockJS fallback enabled for browsers/networks that block
 * raw WebSocket). Clients CONNECT with an Authorization header (see
 * StompAuthChannelInterceptor), then SUBSCRIBE to /user/queue/notifications
 * to receive events addressed to them specifically — Spring's
 * user-destination mechanism resolves "/user/queue/notifications" to the
 * right session using the Principal set at CONNECT time, which is exactly
 * the per-user-room behavior sockets/utils/onlineUsers.js implemented by
 * hand in the source.
 *
 * SINGLE-INSTANCE LIMITATION (documented, not silent): the in-memory simple
 * broker below only works within one running instance of this service — if
 * you scale notification-service horizontally, a user connected to
 * instance A won't receive events published via instance B. The source had
 * the same limitation (a single Node process). Scaling this properly needs
 * an external STOMP relay (e.g. RabbitMQ's STOMP plugin) — flagged in
 * docs/improvements/RECOMMENDED_IMPROVEMENTS.md as a future item, not
 * built here since a single instance matches current scale and matches
 * source parity.
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompAuthChannelInterceptor stompAuthChannelInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // CORS is enforced at api-gateway for HTTP; WS origin left open here since auth is via JWT, not origin
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue", "/topic");
        registry.setApplicationDestinationPrefixes("/app");
        // setUserDestinationPrefix defaults to "/user" — left implicit.
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompAuthChannelInterceptor);
    }
}

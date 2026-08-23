package com.sphere.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sphere.notification.dto.NotificationEvent;
import com.sphere.notification.service.NotificationDeliveryService;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Service-to-service only (X-Internal-Api-Key, see InternalApiKeyFilter) —
 * never routed through api-gateway, never called by the frontend directly.
 * The frontend instead connects to /ws (STOMP) to RECEIVE events; this
 * endpoint is how user-service/post-service PUBLISH them.
 */
@RestController
@RequestMapping("/internal/notifications")
@RequiredArgsConstructor
@Hidden
public class InternalNotificationController {

    private final NotificationDeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<Void> publish(@Valid @RequestBody NotificationEvent event) {
        deliveryService.deliver(event);
        return ResponseEntity.accepted().build();
    }
}

package com.sphere.notification.ws;

import java.security.Principal;

/** Minimal Principal wrapping the authenticated user id (as a string) — see StompAuthChannelInterceptor javadoc. */
public record StompPrincipal(String name) implements Principal {

    @Override
    public String getName() {
        return name;
    }
}

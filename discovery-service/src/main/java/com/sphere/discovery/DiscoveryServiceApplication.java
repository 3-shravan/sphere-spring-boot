package com.sphere.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Eureka service registry for the Sphere microservices platform.
 *
 * All other Sphere services (api-gateway, user-service, post-service, ...)
 * register themselves here and discover each other by logical service name
 * instead of hardcoded host:port pairs.
 */
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}

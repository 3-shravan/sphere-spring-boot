package com.sphere.ai.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an upstream AI provider (OpenAI, etc.) returns an error
 * or the request to the provider fails (network, quota, invalid response).
 */
public class AiProviderException extends ApiException {
  public AiProviderException(String message) {
    super(HttpStatus.BAD_GATEWAY, ErrorType.AiProviderError, message);
  }
}

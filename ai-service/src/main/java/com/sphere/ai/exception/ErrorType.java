package com.sphere.ai.exception;

/** Mirrors ErrorType across all Sphere services — same wire contract. */
public enum ErrorType {
  BadRequest,
  Unauthorized,
  NotFound,
  ValidationError,
  Forbidden,
  Conflict,
  InternalServerError,
  ServiceUnavailable,
  TokenExpired,
  BadToken,
  AccessTokenError,
  AiProviderError
}

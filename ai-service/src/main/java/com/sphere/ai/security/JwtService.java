package com.sphere.ai.security;

import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Verification-only mirror of user-service's JwtService.
 * ai-service never issues tokens — it only validates them.
 * Shares JWT_SECRET with user-service (stateless JWT, per architecture).
 */
@Service
public class JwtService {

  private final Key signingKey;

  public JwtService(@Value("${sphere.jwt.secret}") String secret) {
    byte[] keyBytes;
    try {
      keyBytes = Decoders.BASE64.decode(secret);
    } catch (IllegalArgumentException notBase64) {
      keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
    this.signingKey = Keys.hmacShaKeyFor(keyBytes.length >= 32 ? keyBytes : pad(keyBytes));
  }

  private byte[] pad(byte[] keyBytes) {
    byte[] padded = new byte[32];
    System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
    return padded;
  }

  public Long parseUserId(String token) {
    Claims claims = Jwts.parser()
        .verifyWith((javax.crypto.SecretKey) signingKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
    Object id = claims.get("id");
    if (id instanceof Number n) {
      return n.longValue();
    }
    return Long.parseLong(id.toString());
  }
}

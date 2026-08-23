package com.sphere.user.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Ports user.model.js#generateAuthToken / middlewares/authUser.js's verify
 * step. Token payload intentionally mirrors the source's minimal claim set
 * (`{ id: this._id }`) — no roles/authorities, matching the source's flat
 * permission model (every user has identical rights over their own
 * resources; there is no admin role anywhere in the Node app).
 */
@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationSeconds;

    public JwtService(
            @Value("${sphere.jwt.secret}") String secret,
            @Value("${sphere.jwt.expiration-seconds}") long expirationSeconds
    ) {
        // JWT_SECRET in the Node source is a plain passphrase (HMAC), not a
        // base64 key — decode-if-base64-else-utf8 keeps local dev painless
        // while still accepting a properly generated key in production.
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException notBase64) {
            keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes.length >= 32 ? keyBytes : pad(keyBytes));
        this.expirationSeconds = expirationSeconds;
    }

    private byte[] pad(byte[] keyBytes) {
        // HS256 requires >=256-bit keys; guard against a too-short dev secret
        // instead of failing unhelpfully at signing time.
        byte[] padded = new byte[32];
        System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
        return padded;
    }

    public String generateToken(Long userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationSeconds * 1000);
        return Jwts.builder()
                .claim("id", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    /** Throws io.jsonwebtoken.JwtException / ExpiredJwtException on failure — handled by GlobalExceptionHandler. */
    public Long parseUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Object id = claims.get("id");
        return id instanceof Integer i ? i.longValue() : (Long) id;
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }
}

package org.example.se1979su25g2be.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwtSecret:mySecretKeyForJWTSigningMustBeLongEnoughForHS512Algorithm}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs:86400000}")
    private int jwtExpirationInMs;

    private SecretKey getSigningKey() {
        // Ensure the key is long enough for HS512 (at least 64 bytes)
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 64) {
            // Pad the key if it's too short
            byte[] paddedKey = new byte[64];
            System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, 64));
            return Keys.hmacShaKeyFor(paddedKey);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

            return Jwts.builder()
                    .subject(Integer.toString(userPrincipal.getId()))
                    .claim("username", userPrincipal.getUsername())
                    .claim("role", userPrincipal.getRole())
                    .issuedAt(new Date())
                    .expiration(expiryDate)
                    .signWith(getSigningKey(), Jwts.SIG.HS512)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating JWT token: {}", e.getMessage());
            throw new RuntimeException("Could not generate JWT token", e);
        }
    }

    public Integer getUserIdFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String subject = claims.getSubject();
            if (subject == null || subject.isEmpty()) {
                throw new IllegalArgumentException("JWT subject is null or empty");
            }
            return Integer.parseInt(subject);
        } catch (NumberFormatException e) {
            logger.error("Error parsing user ID from JWT: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid user ID in JWT token", e);
        } catch (Exception e) {
            logger.error("Error extracting user ID from JWT: {}", e.getMessage());
            throw new RuntimeException("Could not extract user ID from JWT", e);
        }
    }

    public String getUsernameFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String username = claims.get("username", String.class);
            if (username == null || username.isEmpty()) {
                throw new IllegalArgumentException("Username claim is null or empty");
            }
            return username;
        } catch (Exception e) {
            logger.error("Error extracting username from JWT: {}", e.getMessage());
            throw new RuntimeException("Could not extract username from JWT", e);
        }
    }

    public String getRoleFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String role = claims.get("role", String.class);
            return role != null ? role : "USER"; // Default to USER if role is null
        } catch (Exception e) {
            logger.error("Error extracting role from JWT: {}", e.getMessage());
            return "USER"; // Default role on error
        }
    }

    public boolean validateToken(String authToken) {
        if (authToken == null || authToken.trim().isEmpty()) {
            logger.error("JWT token is null or empty");
            return false;
        }

        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("Unexpected error validating JWT token: {}", ex.getMessage());
        }
        return false;
    }

    // Helper method to extract claims safely
    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Method to check if token is expired
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            logger.error("Error checking token expiration: {}", e.getMessage());
            return true; // Consider expired if we can't check
        }
    }

    // Method to get token expiration date
    public Date getExpirationDateFromToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration();
        } catch (Exception e) {
            logger.error("Error getting expiration date from token: {}", e.getMessage());
            return null;
        }
    }
}

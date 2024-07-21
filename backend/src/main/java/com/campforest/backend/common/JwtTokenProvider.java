package com.campforest.backend.common;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;

@Component
@Getter
public class JwtTokenProvider {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.accessToken-expiration}")
	private long accessTokenExpiration;

	@Value("${jwt.refreshToken-expiration}")
	private long refreshTokenExpiration;

	public String generateAccessToken(String userEmail) {
		return Jwts.builder()
				.issuer("CampForest")
				.subject("JWT Token")
				.claim("userEmail", userEmail)
				.issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + accessTokenExpiration))
				.signWith(getSecretKey())
				.compact();
	}

	public String generateRefreshToken(String userEmail) {
		return Jwts.builder()
				.subject("JWT Token")
				.claim("userEmail", userEmail)
				.issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + refreshTokenExpiration))
				.signWith(getSecretKey())
				.compact();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token);
			return true;
		} catch (JwtException | IllegalArgumentException exception) {
			return false;
		}
	}

	public Claims getClaims(String token) {
		return Jwts.parser()
				.verifyWith(getSecretKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
}

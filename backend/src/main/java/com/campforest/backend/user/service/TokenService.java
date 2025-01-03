package com.campforest.backend.user.service;

import com.campforest.backend.user.dto.response.ResponseRefreshTokenDTO;

public interface TokenService {
	String generateAccessToken(String email);

	String generateRefreshToken(String email);

	ResponseRefreshTokenDTO refreshToken(String refreshToken);

	void blacklistRefreshToken(String refreshToken);

	boolean isRefreshTokenBlacklisted(String refreshToken);

	void invalidateAllUserTokens(String email);
}

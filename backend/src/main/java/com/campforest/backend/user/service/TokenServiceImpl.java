package com.campforest.backend.user.service;

import org.springframework.stereotype.Service;

import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.campforest.backend.user.model.RefreshToken;
import com.campforest.backend.user.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService{

	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;

	@Override
	public String generateAccessToken(String userEmail) {
		return jwtTokenProvider.generateAccessToken(userEmail);
	}

	@Override
	public String generateRefreshToken(String userEmail) {
		String refreshToken = jwtTokenProvider.generateRefreshToken(userEmail);
		saveRefreshToken(userEmail, refreshToken);
		return refreshToken;
	}

	@Override
	public ResponseRefreshTokenDTO refreshToken(String refreshToken) {
		if (jwtTokenProvider.validateToken(refreshToken)) {
			String userEmail = jwtTokenProvider.getClaims(refreshToken).get("userEmail", String.class);
			// TODO : Custom Exception 만들기
			RefreshToken storedToken = refreshTokenRepository.findById(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("Refresh Token not found"));

			if (storedToken.getToken().equals(refreshToken)) {
				refreshTokenRepository.deleteById(userEmail);

				String newAccessToken = jwtTokenProvider.generateAccessToken(userEmail);
				String newRefreshToken = jwtTokenProvider.generateRefreshToken(userEmail);
				RefreshToken newRt = new RefreshToken(userEmail, newRefreshToken,
					jwtTokenProvider.getRefreshTokenExpiration());
				refreshTokenRepository.save(newRt);

				return new ResponseRefreshTokenDTO(newAccessToken, newRefreshToken);
			}
		}
		return null;
	}

	private void saveRefreshToken(String userEmail, String refreshToken) {
		long refreshTokenExpireTime = jwtTokenProvider.getRefreshTokenExpiration();
		RefreshToken rt = new RefreshToken(userEmail, refreshToken, refreshTokenExpireTime);
		refreshTokenRepository.save(rt);
	}
}

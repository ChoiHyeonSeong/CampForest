package com.campforest.backend.user.service;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.config.CustomUserDetailsService;
import com.campforest.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.campforest.backend.user.model.RefreshToken;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.RefreshTokenRepository;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationManager authenticationManager;
	private final CustomUserDetailsService customUserDetailsService;

	@Override
	@Transactional
	public void registByEmail(Users users) {
		userRepository.save(users);
	}

	@Override
	public Optional<Users> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	public Authentication authenticateUser(String email, String password) {
		return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
	}

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
			log.info("userEmail : {}", userEmail);
			// TODO : Custom Exception 만들기
			RefreshToken storedToken = refreshTokenRepository.findById(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("Refresh Token not found"));

			if (storedToken.getToken().equals(refreshToken)) {
				refreshTokenRepository.deleteById(userEmail);

				String newAccessToken = jwtTokenProvider.generateAccessToken(userEmail);
				String newRefreshToken = jwtTokenProvider.generateRefreshToken(userEmail);
				log.info("newAccessToken : {}", newAccessToken);
				log.info("newRefreshToken : {}", newRefreshToken);
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

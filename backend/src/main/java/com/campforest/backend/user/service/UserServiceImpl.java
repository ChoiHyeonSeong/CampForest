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
	private final AuthenticationManager authenticationManager;

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
}

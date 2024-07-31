package com.campforest.backend.user.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.model.Interest;
import com.campforest.backend.user.model.UserImage;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.InterestRepository;
import com.campforest.backend.user.repository.UserImageRepository;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final UserImageRepository userImageRepository;
	private final InterestRepository interestRepository;
	private final TokenService tokenService;
	private final AuthenticationManager authenticationManager;

	@Override
	@Transactional
	public void registUser(RequestRegisterDTO requestDTO) {
		Users users = requestDTO.toEntity();

		Set<Interest> interests = new HashSet<>();
		for (String interestName : requestDTO.getInterests()) {
			Interest interest = interestRepository.findByInterest(interestName);
			interests.add(interest);
		}
	    users.setInterests(interests);
		Users savedUser = userRepository.save(users);

		if(requestDTO.getProfileImage() != null) {
			UserImage userImage = UserImage.builder()
				.user(savedUser)
				.imageUrl(requestDTO.getProfileImage())
				.build();
			userImageRepository.save(userImage);
		}
	}

	@Override
	public Optional<Users> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	public Optional<Users> findByUserId(Long userId) {
		return userRepository.findByUserId(userId);
	}

	@Override
	@Transactional
	public void deleteByEmail(String email) {
		Users users = userRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

		userRepository.delete(users);
		tokenService.invalidateAllUserTokens(email);
	}

	@Override
	public Authentication authenticateUser(String email, String password) {
		return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
	}

	@Override
	public List<Integer> getPythonRecommendUsers(Long userId) {
		RestTemplate restTemplate = new RestTemplate();
		String pythonUrl = "http://127.0.0.1:8000/similar-users/" + userId;
		ResponseEntity<Map> pythonResponse = restTemplate.getForEntity(pythonUrl, Map.class);

		if (pythonResponse.getStatusCode() == HttpStatus.OK) {
			Map<String, Object> responseBody = pythonResponse.getBody();
			return ((List<Integer>) responseBody.get("similar_users"));
		} else {
			return List.of();
		}
	}
}

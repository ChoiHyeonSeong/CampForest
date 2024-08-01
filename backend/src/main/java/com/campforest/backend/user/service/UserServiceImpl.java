package com.campforest.backend.user.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.dto.response.ResponseFollowDTO;
import com.campforest.backend.user.model.Follow;
import com.campforest.backend.user.model.Interest;
import com.campforest.backend.user.model.UserImage;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.FollowRepository;
import com.campforest.backend.user.repository.InterestRepository;
import com.campforest.backend.user.repository.UserImageRepository;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final UserImageRepository userImageRepository;
	private final InterestRepository interestRepository;
	private final FollowRepository followRepository;
	private final TokenService tokenService;
	private final AuthenticationManager authenticationManager;

	@Value("${filter-server.url}")
	private String filterServerUrl;

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
	@Transactional
	public void followUser(Authentication auth, Long followeeId) {
		Users follower = getUserFromAuthentication(auth);
		Users followee = userRepository.findByUserId(followeeId)
			.orElseThrow(() -> new UsernameNotFoundException("팔로우할 사용자를 찾을 수 없습니다."));

		if(follower.equals(followee)) {
			throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
		}

		if(isAlreadyFollowed(follower, followee)) {
			throw new IllegalArgumentException(ErrorCode.FOLLOW_ALREADY_EXISTS.getMessage());
		}

		Follow follow = Follow.builder()
			.follower(follower)
			.followee(followee)
			.build();

		followRepository.save(follow);
		follower.getFollowing().add(follow);
		followee.getFollowers().add(follow);
	}

	@Override
	@Transactional
	public void unfollowUser(Authentication auth, Long followeeId) {
		Users follower = getUserFromAuthentication(auth);
		Users followee = userRepository.findByUserId(followeeId)
			.orElseThrow(() -> new UsernameNotFoundException("언팔로우할 사용자를 찾을 수 없습니다."));

		Follow follow = followRepository.findByFollowerAndFollowee(follower, followee)
			.orElseThrow(() -> new IllegalArgumentException("팔로우하지 않은 사용자입니다."));

		followRepository.delete(follow);
		follower.getFollowing().remove(follow);
		followee.getFollowers().remove(follow);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ResponseFollowDTO> getFollowers(Long userId) {
		return followRepository.findFollowerDTOsByUserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ResponseFollowDTO> getFollowing(Long userId) {
		return followRepository.findFollowingDTOsByUserId(userId);
	}

	@Override
	public List<Integer> getPythonRecommendUsers(Long userId) {
		RestTemplate restTemplate = new RestTemplate();
		String pythonUrl = filterServerUrl + userId;
		ResponseEntity<Map> pythonResponse = restTemplate.getForEntity(pythonUrl, Map.class);

		if (pythonResponse.getStatusCode() == HttpStatus.OK) {
			Map<String, Object> responseBody = pythonResponse.getBody();
			return ((List<Integer>) responseBody.get("similar_users"));
		} else {
			return List.of();
		}
	}

	private Users getUserFromAuthentication(Authentication auth) {
		return userRepository.findByEmail(auth.getName())
			.orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
	}

	private boolean isAlreadyFollowed(Users follower, Users followee) {
		return followRepository.findByFollowerAndFollowee(follower, followee).isPresent();
	}
}

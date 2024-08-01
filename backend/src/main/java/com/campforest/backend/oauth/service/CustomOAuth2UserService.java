package com.campforest.backend.oauth.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.oauth.repository.TempUserRepository;
import com.campforest.backend.oauth.model.OAuthAttributes;
import com.campforest.backend.oauth.model.TempUser;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final JwtTokenProvider jwtTokenProvider;
	private final TempUserRepository tempUserRepository;
	private final UserRepository userRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);

		// kakao, naver 등의 OAuth2 로그인을 구분하기 위한 Key
		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		// OAuth 로그인 시 Key가 되는 PK값. kakao : id, naver : response
		String userNameAttributeName = userRequest.getClientRegistration()
			.getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

		OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
		Users user = userRepository.findByEmail(attributes.getEmail()).orElse(null);

		if (user == null) {
			// 새로운 사용자인 경우, 임시 토큰 생성
			String tempToken = jwtTokenProvider.generateOAuthSignUpToken(attributes.getEmail(), attributes.getName());

			// Redis에 임시 사용자 정보 저장
			TempUser tempUser = TempUser.builder()
				.token(tempToken)
				.email(attributes.getEmail())
				.name(attributes.getName())
				.provider(registrationId)
				.providerId(attributes.getProviderId())
				.build();
			tempUserRepository.save(tempUser);

			// 임시 사용자 정보 생성
			Map<String, Object> tempAttributes = new HashMap<>();
			tempAttributes.put("tempToken", tempToken);

			return new DefaultOAuth2User(
				Collections.singleton(new SimpleGrantedAuthority("ROLE_TEMP")),
				tempAttributes,
				"tempToken");
		} else {
			// 기존 사용자 처리
			if (!registrationId.equals(user.getProvider()) || !attributes.getProviderId().equals(user.getProviderId())) {
				user.updateOAuthInfo(attributes.getProviderId(), registrationId);
				user = userRepository.save(user);
			}

			return new DefaultOAuth2User(
				Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
				attributes.getAttributes(),
				attributes.getNameAttributeKey());
		}
	}
}

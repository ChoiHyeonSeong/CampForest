package com.campforest.backend.oauth.service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.campforest.backend.oauth.model.OAuthAttributes;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

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
		Users user = saveOrUpdate(attributes, registrationId);

		return new DefaultOAuth2User(
			Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
			attributes.getAttributes(),
			attributes.getNameAttributeKey());
	}

	private Users saveOrUpdate(OAuthAttributes attributes, String registrationId) {
		Users user = userRepository.findByEmail(attributes.getEmail())
			.map(entity -> {
				// 변경 사항이 있는 경우만 업데이트
				if(!registrationId.equals(entity.getProvider())
					|| !attributes.getProviderId().equals(entity.getProviderId())) {
					entity.updateOAuthInfo(attributes.getProviderId(), registrationId);
					return userRepository.save(entity);
				}
				// 변경 사항이 없으면 기존 Entity 반환
				return entity;
			})
			.orElseGet(() -> {
				Users newUser = attributes.toEntity(registrationId);
				return userRepository.save(newUser);
			});

		return user;
	}
}

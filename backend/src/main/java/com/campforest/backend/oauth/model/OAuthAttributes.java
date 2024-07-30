package com.campforest.backend.oauth.model;

import java.util.Map;

import com.campforest.backend.user.model.Role;
import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OAuthAttributes {
	private Map<String, Object> attributes;
	private String nameAttributeKey;
	private String name;
	private String email;
	private String providerId;

	public static OAuthAttributes of(String registrationId, String userNameAttributeName,Map<String, Object> attributes) {
		if (registrationId.equals("kakao")) {
			return ofKakao(userNameAttributeName, attributes);
		} else {
			return null;
		}
	}

	private static OAuthAttributes ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		Map<String, Object> kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");

		return OAuthAttributes.builder()
			.name((String) kakaoProfile.get("nickname"))
			.email((String) kakaoAccount.get("email"))
			.providerId(String.valueOf(attributes.get("id")))
			.attributes(attributes)
			.nameAttributeKey(userNameAttributeName)
			.build();
	}
}

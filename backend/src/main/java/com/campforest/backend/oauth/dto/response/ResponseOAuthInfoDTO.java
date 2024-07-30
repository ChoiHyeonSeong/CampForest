package com.campforest.backend.oauth.dto.response;

import lombok.Builder;

@Builder
public class ResponseOAuthInfoDTO {
	private String email;
	private String name;
	private String provider;
	private String providerId;
}

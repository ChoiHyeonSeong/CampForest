package com.campforest.backend.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResponseRefreshTokenDTO {
	private String accessToken;
	private String refreshToken;
}

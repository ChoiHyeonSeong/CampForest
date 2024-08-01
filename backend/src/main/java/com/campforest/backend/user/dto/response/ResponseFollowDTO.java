package com.campforest.backend.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResponseFollowDTO {
	private Long userId;
	private String nickname;
	private String profileImage;
}

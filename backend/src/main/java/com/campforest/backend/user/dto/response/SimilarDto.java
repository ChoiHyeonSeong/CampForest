package com.campforest.backend.user.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimilarDto {

	private Long commonFollowsCount;
	private String userNickName;
	private String userProfileUrl;
	private Long userId;
}

package com.campforest.backend.user.dto.response;

import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class ResponseInfoDTO {
	private Long userId;
	private String nickname;
	private int followingCount;
	private int followerCount;
	private String introduction;
	private String profileImage;
	private Long temperature;
	private boolean isOpen;

	public static ResponseInfoDTO fromEntity(Users users) {
		String imageUrl = users.getUserImage() == null ? null : users.getUserImage().getImageUrl();

		return ResponseInfoDTO.builder()
				.userId(users.getUserId())
				.nickname(users.getNickname())
				.introduction(users.getIntroduction())
				.temperature(users.getTemperature())
				.profileImage(imageUrl)
				.isOpen(users.isOpen())
				.build();
	}
}

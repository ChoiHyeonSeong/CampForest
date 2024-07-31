package com.campforest.backend.user.dto.response;

import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class ResponseInfoDTO {
	private String nickname;
	private int followingCount;
	private int followerCount;
	private String introduction;
	private String profileImage;
	private boolean isOpen;

	public static ResponseInfoDTO fromEntity(Users users) {
		String imageUrl = null;
		if (users.getUserImage() != null) {
			imageUrl = users.getUserImage().getImageUrl();
		}
		return ResponseInfoDTO.builder()
				.nickname(users.getNickname())
				.followingCount(0)
				.followerCount(0)
				.introduction(users.getIntroduction())
				.profileImage(imageUrl)
				.isOpen(users.isOpen())
				.build();
	}
}

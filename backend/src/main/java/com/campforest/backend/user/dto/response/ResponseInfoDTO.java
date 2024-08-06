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
	private boolean isOpen;

	public static ResponseInfoDTO fromEntity(Users users) {
		String imageUrl = null;
		if (users.getUserImage() != null) {
			imageUrl = users.getUserImage().getImageUrl();
		}
		return ResponseInfoDTO.builder()
				.userId(users.getUserId())
				.nickname(users.getNickname())
				.followingCount(users.getFollowing().size())
				.followerCount(users.getFollowers().size())
				.introduction(users.getIntroduction())
				.profileImage(imageUrl)
				.isOpen(users.isOpen())
				.build();
	}
}

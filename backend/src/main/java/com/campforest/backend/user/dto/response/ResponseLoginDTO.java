package com.campforest.backend.user.dto.response;

import java.util.Map;

import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class ResponseLoginDTO {

	private Long userId;
	private String email;
	private String nickname;
	private String profileImage;
	@Setter
	private Map<String, Object> similarUsers;

	public static ResponseLoginDTO fromEntity(Users user) {
		String imageUrl =
			user.getUserImage() == null ? null : user.getUserImage().getImageUrl();

		return ResponseLoginDTO.builder()
			.userId(user.getUserId())
			.email(user.getEmail())
			.nickname(user.getNickname())
			.profileImage(imageUrl)
			.build();
	}
}
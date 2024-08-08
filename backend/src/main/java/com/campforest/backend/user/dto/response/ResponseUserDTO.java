package com.campforest.backend.user.dto.response;

import java.util.Date;
import java.util.Set;

import com.campforest.backend.user.model.Gender;
import com.campforest.backend.user.model.Interest;
import com.campforest.backend.user.model.Users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResponseUserDTO {
	private Long userId;
	private String profileImage;
	private Date birthdate;
	private Gender gender;
	private String nickname;
	private String introduction;
	private boolean isOpen;
	private Set<Interest> interests;

	public static ResponseUserDTO fromEntity(Users user) {
		String imageUrl = null;
		if(user.getUserImage() != null) {
			imageUrl = user.getUserImage().getImageUrl();
		}
		return ResponseUserDTO.builder()
			.userId(user.getUserId())
			.profileImage(imageUrl)
			.birthdate(user.getBirthdate())
			.gender(user.getGender())
			.nickname(user.getNickname())
			.introduction(user.getIntroduction())
			.isOpen(user.isOpen())
			.interests(user.getInterests())
			.build();
	}
}

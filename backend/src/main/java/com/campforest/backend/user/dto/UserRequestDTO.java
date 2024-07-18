package com.campforest.backend.user.dto;

import java.util.Date;

import com.campforest.backend.user.model.Gender;
import com.campforest.backend.user.model.Role;
import com.campforest.backend.user.model.Users;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserRequestDTO {

	private String userName;
	private String email;
	private String password;
	private Role role;
	private Date birthdate;
	private Gender gender;
	private boolean isOpen;
	private String nickname;
	private String phoneNumber;
	private String introduction;
	private String profileImage;

	public Users toEntity() {
		return Users.builder()
			.userName(userName)
			.email(email)
			.password(password)
			.role(role)
			.birthdate(birthdate)
			.gender(gender)
			.isOpen(isOpen)
			.nickname(nickname)
			.phoneNumber(phoneNumber)
			.introduction(introduction)
			.profileImage(profileImage)
			.build();
	}
}
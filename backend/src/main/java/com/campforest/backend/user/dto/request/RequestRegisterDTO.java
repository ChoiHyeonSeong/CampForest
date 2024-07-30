package com.campforest.backend.user.dto.request;

import java.util.Date;

import com.campforest.backend.user.model.Gender;
import com.campforest.backend.user.model.Role;
import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class RequestRegisterDTO {

	private String userName;
	private String email;
	@Setter
	private String password;
	private Role role;
	private Date birthdate;
	private Gender gender;
	private boolean isOpen;
	private String nickname;
	private String provider;
	private String providerId;
	private String phoneNumber;
	private String introduction;
	@Setter
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
			.provider(provider)
			.providerId(providerId)
			.phoneNumber(phoneNumber)
			.introduction(introduction)
			.build();
	}
}
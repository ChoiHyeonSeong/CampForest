package com.campforest.backend.user.dto.request;

import java.util.Date;
import java.util.List;

import com.campforest.backend.user.model.Gender;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestUpdateDTO {
	private Long userId;
	private Date birthdate;
	private Gender gender;
	private String nickname;
	private String introduction;
	private boolean isOpen;
	private List<String> interests;
}

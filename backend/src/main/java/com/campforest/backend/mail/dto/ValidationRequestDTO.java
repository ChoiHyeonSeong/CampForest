package com.campforest.backend.mail.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationRequestDTO {
	private String email;
	private String authCode;
}

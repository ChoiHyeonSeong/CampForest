package com.campforest.backend.sms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestValidationDTO {
	private String phoneNumber;
	private String authCode;
}

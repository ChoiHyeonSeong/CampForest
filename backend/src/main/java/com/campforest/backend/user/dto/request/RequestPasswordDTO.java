package com.campforest.backend.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestPasswordDTO {
	private String token;
	private String password;
}

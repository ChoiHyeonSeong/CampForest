package com.campforest.backend.user.dto.request;

import lombok.Data;

@Data
public class RequestLoginDTO {
	private String email;
	private String password;
}

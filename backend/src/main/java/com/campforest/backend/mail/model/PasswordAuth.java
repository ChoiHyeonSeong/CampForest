package com.campforest.backend.mail.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@RedisHash(value = "passwordAuth", timeToLive = 600)
public class PasswordAuth {
	@Id
	private String resetToken;
	private String email;
}

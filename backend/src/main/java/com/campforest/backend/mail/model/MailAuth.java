package com.campforest.backend.mail.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@RedisHash(value = "mailAuth", timeToLive = 180)
public class MailAuth {
	@Id
	private String email;
	private String authCode;
}

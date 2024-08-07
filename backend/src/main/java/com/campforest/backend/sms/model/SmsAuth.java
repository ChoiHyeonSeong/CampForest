package com.campforest.backend.sms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@RedisHash(value = "smsAuth", timeToLive = 180)
public class SmsAuth {
	@Id
	private String phoneNumber;
	private String authCode;
}

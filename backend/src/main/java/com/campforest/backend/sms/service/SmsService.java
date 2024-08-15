package com.campforest.backend.sms.service;

public interface SmsService {
	void SendSms(String phoneNumber);

	boolean checkAuthCode(String phoneNumber, String authCode);
}

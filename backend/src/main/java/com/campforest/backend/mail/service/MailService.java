package com.campforest.backend.mail.service;

public interface MailService {
	void joinEmail(String email);
	boolean checkAuthCode(String email, String authCode);
}

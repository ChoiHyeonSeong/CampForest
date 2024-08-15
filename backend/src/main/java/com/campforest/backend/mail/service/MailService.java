package com.campforest.backend.mail.service;

public interface MailService {
	void joinEmail(String email);

	void passwordEmail(String email);

	boolean checkAuthCode(String email, String authCode);

	boolean verifyResetToken(String email, String token);
}

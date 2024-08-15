package com.campforest.backend.mail.service;

import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.campforest.backend.mail.model.MailAuth;
import com.campforest.backend.mail.model.PasswordAuth;
import com.campforest.backend.mail.repository.MailAuthRepository;
import com.campforest.backend.mail.repository.PasswordAuthRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

	private final JavaMailSender javaMailSender;
	private final MailAuthRepository mailAuthRepository;
	private final PasswordAuthRepository passwordAuthRepository;

	@Value("${spring.mail.username}")
	private String username;

	@Value("${frontend.url}")
	private String frontendUrl;

	private int authCode;

	@Override
	public void joinEmail(String email) {
		makeRandomAuthCode();
		String title = "[CampForest] : 회원가입을 위한 메일입니다.";
		String content =
			"이메일을 인증하기 위한 절차입니다." +
				"<br><br>" +
				"인증 번호는 " + authCode + "입니다." +
				"<br>" +
				"회원 가입 폼에 해당 번호를 입력해주세요.";

		sendEmail(username, email, title, content);
	}

	@Override
	public void passwordEmail(String email) {
		String resetToken = generateResetToken();
		String resetUrl = frontendUrl + "/user/password/change?token=" + resetToken;

		String title = "[CampForest] : 비밀번호 변경을 위한 메일입니다.";
		String content =
			"비밀번호 변경을 위한 링크입니다." +
				"<br><br>" +
				"아래 링크를 클릭하여 비밀번호를 변경해주세요:" +
				"<br>" +
				"<a href='" + resetUrl + "'>" + resetUrl + "</a>" +
				"<br><br>" +
				"이 링크는 10분간 유효합니다.";

		sendEmail(username, email, title, content);

		PasswordAuth passwordAuth = new PasswordAuth(resetToken, email);
		passwordAuthRepository.save(passwordAuth);
	}

	@Override
	public boolean checkAuthCode(String email, String authCode) {
		Optional<MailAuth> storedAuth = mailAuthRepository.findById(email);

		if (storedAuth.isPresent()) {
			MailAuth mailAuth = storedAuth.get();
			String storedAuthCode = mailAuth.getAuthCode();

			if(storedAuthCode.equals(authCode)) {
				mailAuthRepository.deleteById(email);
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean verifyResetToken(String email, String token) {
		Optional<PasswordAuth> storedAuth = passwordAuthRepository.findById(email);

		if (storedAuth.isPresent()) {
			PasswordAuth passwordAuth = storedAuth.get();
			String storedToken = passwordAuth.getResetToken();

			if(storedToken.equals(token)) {
				passwordAuthRepository.deleteById(email);
				return true;
			}
		}
		return false;
	}

	private void sendEmail(String setFrom, String toMail, String title, String content) {
		MimeMessage message = javaMailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			helper.setFrom(setFrom);
			helper.setTo(toMail);
			helper.setSubject(title);
			helper.setText(content,true);

			javaMailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}

		MailAuth mailAuth = new MailAuth(toMail, Integer.toString(authCode));
		mailAuthRepository.save(mailAuth);
	}

	private void makeRandomAuthCode() {
		Random random = new Random();
		String randomCode = "";
		for(int i = 0; i < 6; i++) {
			randomCode += Integer.toString(random.nextInt(10));
		}

		authCode = Integer.parseInt(randomCode);
	}

	private String generateResetToken() {
		return UUID.randomUUID().toString();
	}
}

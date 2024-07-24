package com.campforest.backend.mail.service;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.campforest.backend.mail.model.MailAuth;
import com.campforest.backend.mail.repository.MailAuthRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

	private final JavaMailSender javaMailSender;
	private final MailAuthRepository mailAuthRepository;

	@Value("${spring.mail.username}")
	private String username;
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
}

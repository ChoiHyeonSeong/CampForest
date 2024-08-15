package com.campforest.backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

import jakarta.annotation.PostConstruct;

@Component
public class SmsUtil {

	@Value("${coolsms.api.key}")
	private String apiKey;

	@Value("${coolsms.api.secret}")
	private String apiSecretKey;

	@Value("${coolsms.api.domain}")
	private String appDomain;

	@Value("${coolsms.api.from}")
	private String from;

	private DefaultMessageService messageService;

	@PostConstruct
	private void init(){
		this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, appDomain);
	}

	// 단일 메시지 발송 예제
	public SingleMessageSentResponse sendOne(String to, String verificationCode) {
		try {
			Message message = new Message();
			message.setFrom(from);
			message.setTo(to);
			message.setText("[CampForest] 아래의 인증번호를 입력해주세요\n" + verificationCode);

			return this.messageService.sendOne(new SingleMessageSendingRequest(message));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}
}

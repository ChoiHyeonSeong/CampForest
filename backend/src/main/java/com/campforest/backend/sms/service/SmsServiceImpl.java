package com.campforest.backend.sms.service;

import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.campforest.backend.sms.model.SmsAuth;
import com.campforest.backend.sms.repository.SmsRepository;
import com.campforest.backend.utils.SmsUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

	private final SmsUtil smsUtil;
	private final SmsRepository smsRepository;
	private String authCode;

	@Override
	public void SendSms(String phoneNumber) {
		makeRandomAuthCode();
		smsUtil.sendOne(phoneNumber, authCode);

		SmsAuth sms = SmsAuth.builder().phoneNumber(phoneNumber).authCode(authCode).build();
		smsRepository.save(sms);
	}

	@Override
	public boolean checkAuthCode(String phoneNumber, String authCode) {
		Optional<SmsAuth> storedAuth = smsRepository.findById(phoneNumber);

		if(storedAuth.isPresent()) {
			SmsAuth smsAuth = storedAuth.get();
			String storedAuthCode = smsAuth.getAuthCode();

			if(storedAuthCode.equals(authCode)) {
				smsRepository.deleteById(phoneNumber);
				return true;
			}
		}
		return false;
	}

	private void makeRandomAuthCode() {
		Random random = new Random();
		String randomCode = "";
		for(int i = 0; i < 6; i++) {
			randomCode += Integer.toString(random.nextInt(10));
		}

		authCode = randomCode;
	}
}

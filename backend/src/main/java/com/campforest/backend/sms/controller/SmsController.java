package com.campforest.backend.sms.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.sms.dto.RequestSmsDTO;
import com.campforest.backend.sms.dto.RequestValidationDTO;
import com.campforest.backend.sms.service.SmsService;
import com.campforest.backend.user.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
public class SmsController {

	private final SmsService smsService;
	private final UserRepository userRepository;

	@PostMapping("/request")
	public ApiResponse<?> smsSend(@RequestBody RequestSmsDTO requestDTO) {
		try {
			String phoneNumber = requestDTO.getPhoneNumber();
			if(userRepository.existsByPhoneNumber(phoneNumber)) {
				return ApiResponse.createError(ErrorCode.ALREADY_EXIST_PHONE_NUMBER);
			}

			smsService.SendSms(phoneNumber);
			return ApiResponse.createSuccess(null, "SMS 인증 요청에 성공하였습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SMS_SEND_FAIL);
		}
	}

	@PostMapping("/validation")
	public ApiResponse<?> smsValidation(@RequestBody RequestValidationDTO requestDTO) {
		if(smsService.checkAuthCode(requestDTO.getPhoneNumber(), requestDTO.getAuthCode())) {
			return ApiResponse.createSuccess(null, "SMS 인증이 정상적으로 완료되었습니다.");
		}
		return ApiResponse.createError(ErrorCode.SMS_CODE_NOT_MATCH);
	}
}

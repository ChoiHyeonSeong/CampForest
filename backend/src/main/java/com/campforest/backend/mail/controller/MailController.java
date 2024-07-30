package com.campforest.backend.mail.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.mail.dto.EmailRequestDTO;
import com.campforest.backend.mail.dto.ValidationRequestDTO;
import com.campforest.backend.mail.service.MailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class MailController {

	private final MailService mailService;

	@PostMapping("/request")
	public ApiResponse<?> mailSend(@RequestBody EmailRequestDTO requestDTO) {
		mailService.joinEmail(requestDTO.getEmail());
		return ApiResponse.createSuccess(null, "이메일을 정상적으로 발송하였습니다.");
	}

	@PostMapping("/validation")
	public ApiResponse<?> mailValidation(@RequestBody ValidationRequestDTO requestDTO) {
		if (mailService.checkAuthCode(requestDTO.getEmail(), requestDTO.getAuthCode())) {
			return ApiResponse.createSuccess(null, "이메일 인증이 정상적으로 완료되었습니다.");
		}
		return ApiResponse.createError(ErrorCode.EMAIL_CODE_NOT_MATCH);
	}
}

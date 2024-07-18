package com.campforest.backend.user.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.user.dto.UserRequestDTO;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final PasswordEncoder passwordEncoder;

	@PostMapping("/regist/email")
	public ApiResponse<?> registByEmail(@RequestBody UserRequestDTO requestDTO) {
		try {
			String encodedPassword = passwordEncoder.encode(requestDTO.getPassword());
			requestDTO.setPassword(encodedPassword);
			userService.registByEmail(requestDTO.toEntity());

			return ApiResponse.createSuccess(null, "회원가입이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(e.getMessage());
		}
	}
}

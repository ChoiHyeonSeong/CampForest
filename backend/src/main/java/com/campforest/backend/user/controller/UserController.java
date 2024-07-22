package com.campforest.backend.user.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.user.dto.request.RequestLoginDTO;
import com.campforest.backend.user.dto.request.RequestRefreshTokenDTO;
import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.campforest.backend.user.dto.response.ResponseUserDTO;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.TokenService;
import com.campforest.backend.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final TokenService tokenService;
	private final PasswordEncoder passwordEncoder;


	@PostMapping("/regist/email")
	public ApiResponse<?> registByEmail(@RequestBody RequestRegisterDTO requestDTO) {
		try {
			String encodedPassword = passwordEncoder.encode(requestDTO.getPassword());
			requestDTO.setPassword(encodedPassword);
			userService.registByEmail(requestDTO.toEntity());

			return ApiResponse.createSuccess(null, "회원가입이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.USER_REGISTER_FAILED);
		}
	}

	@PostMapping("/login")
	public ApiResponse<?> login(@RequestBody RequestLoginDTO requestDTO, HttpServletResponse response) {
		Authentication authentication = userService.authenticateUser(requestDTO.getEmail(), requestDTO.getPassword());

		if (authentication.isAuthenticated()) {
			SecurityContextHolder.getContext().setAuthentication(authentication);

			String accessToken = tokenService.generateAccessToken(authentication.getName());
			String refreshToken = tokenService.generateRefreshToken(authentication.getName());

			ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.maxAge(60 * 60 * 24 * 14)
				.path("/")
				.secure(true)
				// TODO : sameSite 설정 변경
				.sameSite("None")
				.build();

			response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
			response.setHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

			return ApiResponse.createSuccess(null, "로그인이 완료되었습니다.");
		}
		return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
	}

	@GetMapping
	public ApiResponse<?> getUserDetailsAfterLogin(Authentication authentication, HttpServletRequest request) {
		try {
			Users users = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			ResponseUserDTO responseDTO = ResponseUserDTO.fromEntity(users);

			return ApiResponse.createSuccess(responseDTO, "유저 정보 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
		}
	}

	@PostMapping("/refreshToken")
	public ApiResponse<?> refreshToken(@RequestBody RequestRefreshTokenDTO requestDTO, HttpServletResponse response) {
		try {
			ResponseRefreshTokenDTO responseDTO = tokenService.refreshToken(requestDTO.getRefreshToken());
			String accessToken = responseDTO.getAccessToken();
			String refreshToken = responseDTO.getRefreshToken();

			ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.maxAge(60 * 60 * 24 * 14)
				.path("/")
				.secure(true)
				// TODO : sameSite 설정 변경
				.sameSite("None")
				.build();

			response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
			response.setHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

			return ApiResponse.createSuccess(null, "Refresh Token을 통한 Access Token 재발급 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
		}
	}
}

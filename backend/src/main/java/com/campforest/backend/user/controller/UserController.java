package com.campforest.backend.user.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.kms.model.NotFoundException;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.user.dto.request.RequestLoginDTO;
import com.campforest.backend.user.dto.request.RequestRefreshTokenDTO;
import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.campforest.backend.user.dto.response.ResponseUserDTO;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.TokenService;
import com.campforest.backend.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

	private final S3Service s3Service;
	private final UserService userService;
	private final TokenService tokenService;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;

	@PostMapping("/auth/regist")
	public ApiResponse<?> registUser(
		@RequestPart(value = "profileImage", required = false) MultipartFile profileImageFile,
		@RequestPart(value = "registUserDto") RequestRegisterDTO requestDTO) {
		try {
			String encodedPassword = passwordEncoder.encode(requestDTO.getPassword());
			requestDTO.setPassword(encodedPassword);

			if(profileImageFile != null) {
				String extension = profileImageFile.getOriginalFilename()
					.substring(profileImageFile.getOriginalFilename().lastIndexOf("."));
				String fileUrl = s3Service.upload(profileImageFile.getOriginalFilename(), profileImageFile, extension);
				requestDTO.setProfileImage(fileUrl);
			}
			userService.registUser(requestDTO);

			return ApiResponse.createSuccess(null, "회원가입이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.USER_REGISTER_FAILED);
		}
	}

	@PostMapping("/auth/login")
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

			Users users = userService.findByEmail(requestDTO.getEmail())
				.orElseThrow(() -> new NotFoundException("유저 정보 조회 실패"));
			ResponseUserDTO responseDTO = ResponseUserDTO.fromEntity(users);

			return ApiResponse.createSuccess(responseDTO, "로그인이 완료되었습니다.");
		}
		return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
	}

	@PostMapping("/auth/logout")
	public ApiResponse<?> logout(HttpServletRequest request, HttpServletResponse response) {
		String refreshToken = extractRefreshToken(request);

		if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
			tokenService.blacklistRefreshToken(refreshToken);

			Cookie cookie = new Cookie("refreshToken", null);
			cookie.setMaxAge(0);
			cookie.setPath("/");
			response.addCookie(cookie);

			return ApiResponse.createSuccess(null, "로그아웃이 완료되었습니다.");
		}
		return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
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

	@PostMapping("/auth/refreshToken")
	public ApiResponse<?> refreshToken(@RequestBody RequestRefreshTokenDTO requestDTO, HttpServletResponse response) {
		try {
			ResponseRefreshTokenDTO responseDTO = tokenService.refreshToken(requestDTO.getRefreshToken());

			if (responseDTO == null) {
				throw new IllegalArgumentException("Refresh Token이 만료되었거나 존재하지 않습니다.");
			}
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
		} catch (IllegalArgumentException e) {
			return ApiResponse.createError(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
		}
	}

	@DeleteMapping
	public ApiResponse<?> withdrawUser(Authentication authentication, HttpServletResponse response) {
		try {
			String userEmail = authentication.getName();
			userService.deleteByEmail(userEmail);

			Cookie cookie = new Cookie("refreshToken", null);
			cookie.setMaxAge(0);
			cookie.setPath("/");
			cookie.setSecure(true);
			cookie.setHttpOnly(true);

			response.addCookie(cookie);
			return ApiResponse.createSuccess(null, "회원 탈퇴가 완료되었습니다.");
		} catch (UsernameNotFoundException e) {
			return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.USER_DELETE_FAILED);
		}
	}

	private String extractRefreshToken(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if(cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("refreshToken")) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}
}

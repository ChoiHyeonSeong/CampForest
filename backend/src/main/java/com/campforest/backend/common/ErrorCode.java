package com.campforest.backend.common;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// Internal Server Error
	INTERNAL_SERVER_ERROR("C001", HttpStatus.INTERNAL_SERVER_ERROR, "서버에 오류가 발생했습니다."),

	// User Error
	USER_REGISTER_FAILED("U001", HttpStatus.BAD_REQUEST, "사용자 등록에 실패했습니다."),
	USER_NOT_FOUND("U002", HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	PASSWORD_NOT_MATCH("U003", HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),

	// Unauthorized
	AUTHENTICATION_FAILED("A001", HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
	NO_JWT_TOKEN("A002", HttpStatus.UNAUTHORIZED, "JWT 토큰이 없습니다."),
	INVALID_JWT_TOKEN("A003", HttpStatus.UNAUTHORIZED, "유효하지 않은 JWT 토큰입니다."),
	ACCESS_TOKEN_EXPIRED("A004", HttpStatus.UNAUTHORIZED, "Access Token이 만료되었습니다."),
	REFRESH_TOKEN_EXPIRED("A005", HttpStatus.UNAUTHORIZED, "Refresh Token이 만료되었습니다."),
	REFRESH_TOKEN_BLACKLISTED("A006", HttpStatus.UNAUTHORIZED, "블랙리스트에 등록된 Refresh Token입니다."),
	;

	private final String code;
	private final HttpStatus httpStatus;
	private final String message;
}

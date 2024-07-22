package com.campforest.backend.config;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.utils.ErrorResponseUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException, ServletException {
		ErrorCode errorCode;
		if (authException instanceof BadCredentialsException) {
			errorCode = ErrorCode.PASSWORD_NOT_MATCH;
		} else if (authException instanceof UsernameNotFoundException) {
			errorCode = ErrorCode.USER_NOT_FOUND;
		} else {
			errorCode = ErrorCode.AUTHENTICATION_FAILED;
		}

		ErrorResponseUtil.sendErrorResponse(response, errorCode);
	}
}

package com.campforest.backend.utils;

import java.io.IOException;

import org.springframework.http.MediaType;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

public class ErrorResponseUtil {

	private static final ObjectMapper objectMapper = new ObjectMapper();

	public static void sendErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		response.setStatus(errorCode.getHttpStatus().value());

		String jsonResponse = objectMapper.writeValueAsString(ApiResponse.createError(errorCode));
		response.getWriter().write(jsonResponse);
	}
}

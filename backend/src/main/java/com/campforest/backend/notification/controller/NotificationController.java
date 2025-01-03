package com.campforest.backend.notification.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.notification.dto.NotificationDTO;
import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.notification.service.SseEmitters;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService notificationService;
	private final UserService userService;
	private final SseEmitters sseEmitters;

	@GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) {
		Users users = userService.findByEmail(userDetails.getUsername())
			.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

		SseEmitter emitter = sseEmitters.createEmitter(users.getUserId());

		try {
			emitter.send(SseEmitter.event()
				.name("connect")
				.data("SSE 연결 성공"));
		} catch (IOException e) {
			emitter.completeWithError(e);
		}

		return emitter;
	}

	@PostMapping("/readAll")
	public ApiResponse<?> markAsRead(@AuthenticationPrincipal UserDetails userDetails) {
		Users user = userService.findByEmail(userDetails.getUsername())
			.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
		int updateCount = notificationService.markAsRead(user);
		return ApiResponse.createSuccess(null, updateCount + "개의 알림을 읽음 처리 완료");
	}

	@GetMapping("/all")
	public ApiResponse<?> getAll(@AuthenticationPrincipal UserDetails userDetails) {
		try {
			Users users = userService.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

			List<NotificationDTO> response = notificationService.getAll(users).stream()
				.map(NotificationDTO::fromEntity)
				.toList();

			return ApiResponse.createSuccess(response, "알림 목록 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.NOTIFICATION_NOT_FOUND);
		}

	}

	@DeleteMapping("/{notificationId}")
	public ApiResponse<?> deleteNotification(
		@AuthenticationPrincipal UserDetails userDetails,
		@PathVariable Long notificationId) {
		try {
			Users user = userService.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

			Notification notification = notificationService.findById(notificationId);

			if(!notification.getReceiver().equals(user)) {
				return ApiResponse.createError(ErrorCode.NOTIFICATION_NOT_MATCH_WITH_RECEIVER);
			}

			notificationService.deleteNotification(notification);
			return ApiResponse.createSuccess(null, "알림 삭제 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.NOTIFICATION_DELETE_FAILED);
		}
	}
}

package com.campforest.backend.notification.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.campforest.backend.notification.dto.NotificationDTO;
import com.campforest.backend.notification.model.Notification;

@Component
public class SseEmitters {
	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

	public SseEmitter createEmitter(Long userId) {
		SseEmitter emitter = new SseEmitter(7200000L); // 2시간
		emitters.put(userId, emitter);
		emitter.onCompletion(() -> emitters.remove(userId));
		emitter.onTimeout(() -> emitters.remove(userId));
		emitter.onError((e) -> emitters.remove(userId));
		return emitter;
	}

	public void send(Long userId, NotificationDTO notification) {
		SseEmitter emitter = emitters.get(userId);
		if (emitter != null) {
			try {
				emitter.send(SseEmitter.event()
					.name("notification")
					.data(notification));
			} catch (IOException e) {
				emitters.remove(userId);
			}
		}
	}

	// 연결 유지를 위한 더미 이벤트 전송 메서드
	@Scheduled(fixedRate = 300000) // 5분
	public void sendKeepAlive() {
		emitters.forEach((userId, emitter) -> {
			try {
				emitter.send(SseEmitter.event().name("keepAlive").data(""));
			} catch (IOException e) {
				emitters.remove(userId);
				emitter.completeWithError(e);
			}
		});
	}
}
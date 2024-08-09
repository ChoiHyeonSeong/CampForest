package com.campforest.backend.notification.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.campforest.backend.notification.dto.NotificationDTO;
import com.campforest.backend.notification.model.Notification;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SseEmitters {
	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>(256, 0.75f, 64);
	private final Semaphore semaphore = new Semaphore(100);

	public SseEmitter createEmitter(Long userId) {
		SseEmitter emitter = new SseEmitter(7200000L); // 2시간
		emitters.put(userId, emitter);
		emitter.onCompletion(() -> {
			emitters.remove(userId);
			log.info("SSE connection completed for user: {}", userId);
		});
		emitter.onTimeout(() -> {
			emitters.remove(userId);
			log.warn("SSE connection timed out for user: {}", userId);
		});
		emitter.onError((e) -> {
			emitters.remove(userId);
			log.error("SSE connection error for user: {}", userId, e);
		});
		return emitter;
	}

	public void send(Long userId, NotificationDTO notification) {
		SseEmitter emitter = emitters.get(userId);
		if (emitter != null) {
			try {
				semaphore.acquire();
				emitter.send(SseEmitter.event()
					.name("notification")
					.data(notification));
			} catch (IOException | InterruptedException e) {
				emitters.remove(userId);
				log.error("Failed to send notification to user: {}", userId, e);
			} finally {
				semaphore.release();
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
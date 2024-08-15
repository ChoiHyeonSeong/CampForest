package com.campforest.backend.notification.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.campforest.backend.notification.dto.NotificationDTO;
import com.campforest.backend.notification.model.Notification;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SseEmitters {
	private final Map<Long, EmitterInfo> emitters = new ConcurrentHashMap<>();

	private static class EmitterInfo {
		final SseEmitter emitter;
		final long creationTime;

		EmitterInfo(SseEmitter emitter) {
			this.emitter = emitter;
			this.creationTime = System.currentTimeMillis();
		}
	}

	public SseEmitter createEmitter(Long userId) {
		removeEmitter(userId);
		SseEmitter emitter = new SseEmitter(300000L); // 5분
		emitters.put(userId, new EmitterInfo(emitter));
		emitter.onCompletion(() -> removeEmitter(userId));
		emitter.onTimeout(() -> removeEmitter(userId));
		emitter.onError((e) -> removeEmitter(userId));
		return emitter;
	}

	public void send(Long userId, NotificationDTO notification) {
		EmitterInfo info = emitters.get(userId);
		if (info != null) {
			try {
				info.emitter.send(SseEmitter.event()
					.name("notification")
					.data(notification));
			} catch (IOException e) {
				log.warn("Failed to send notification to user: {}", userId, e);
				removeEmitter(userId);
			}
		}
	}

	// @Scheduled(fixedRate = 300000) // 5분마다
	// public void sendKeepAlive() {
	// 	emitters.forEach((userId, info) -> {
	// 		try {
	// 			info.emitter.send(SseEmitter.event().name("keepAlive").data(""));
	// 		} catch (IOException e) {
	// 			log.warn("Failed to send keep-alive to user: {}", userId, e);
	// 			removeEmitter(userId);
	// 		}
	// 	});
	// }

	@Scheduled(fixedRate = 3600000) // 1시간마다
	public void cleanupOldEmitters() {
		long now = System.currentTimeMillis();
		emitters.entrySet().removeIf(entry -> {
			if (now - entry.getValue().creationTime > 7200000) {
				try {
					entry.getValue().emitter.complete();
				} catch (Exception e) {
					log.warn("Error while completing old emitter for user: {}", entry.getKey(), e);
				}
				return true;
			}
			return false;
		});
	}

	private void removeEmitter(Long userId) {
		EmitterInfo info = emitters.remove(userId);
		if (info != null) {
			try {
				info.emitter.complete();
			} catch (Exception e) {
				log.warn("Error while completing emitter for user: {}", userId, e);
			}
		}
	}
}
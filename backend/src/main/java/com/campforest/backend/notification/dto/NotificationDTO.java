package com.campforest.backend.notification.dto;

import java.time.LocalDateTime;
import java.util.Date;

import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.notification.model.NotificationType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NotificationDTO {
	private Long notificationId;
	private String senderProfileImage;
	private String senderNickname;
	private Long senderId;
	private NotificationType notificationType;
	private boolean isRead;
	private String message;
	private LocalDateTime createdAt;
	@Setter
	private Long roomId;

	public static NotificationDTO fromEntity(Notification notification) {
		String imageUrl =
			notification.getSender().getUserImage() == null ? null : notification.getSender().getUserImage().getImageUrl();

		return NotificationDTO.builder()
			.notificationId(notification.getNotificationId())
			.senderProfileImage(imageUrl)
			.senderNickname(notification.getSender().getNickname())
			.senderId(notification.getSender().getUserId())
			.notificationType(notification.getNotificationType())
			.isRead(notification.isRead())
			.message(notification.getMessage())
			.createdAt(notification.getCreatedAt())
			.build();
	}
}

package com.campforest.backend.notification.service;

import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.user.model.Users;

public interface NotificationService {
	void createNotification(Users receiver, NotificationType type, String message);

	void markAsRead(Long notificationId);

	void deleteNotification(Long notificationId);
}

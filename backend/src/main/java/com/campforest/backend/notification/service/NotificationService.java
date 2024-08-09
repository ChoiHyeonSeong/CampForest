package com.campforest.backend.notification.service;

import java.util.List;

import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.user.model.Users;

public interface NotificationService {
	void createNotification(Users receiver, Users sender, NotificationType type, String message);

	int markAsRead(Users user);

	List<Notification> getAll(Users user);

	void deleteNotification(Long notificationId);
}

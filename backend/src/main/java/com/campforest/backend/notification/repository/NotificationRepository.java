package com.campforest.backend.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.notification.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}

package com.campforest.backend.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.user.model.Users;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findAllByReceiverOrderByCreatedAtDesc(Users receiver);
}

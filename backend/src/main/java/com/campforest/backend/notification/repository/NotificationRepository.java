package com.campforest.backend.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.user.model.Users;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findAllByReceiverOrderByCreatedAtDesc(Users receiver);

	@Modifying
	@Query("update Notification n set n.isRead = true where n.receiver = :receiver and n.isRead = false")
	int updateAllByReceiver(@Param("receiver") Users receiver);
}

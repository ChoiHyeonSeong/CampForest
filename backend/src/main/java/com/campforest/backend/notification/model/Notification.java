package com.campforest.backend.notification.model;

import java.util.Date;

import org.hibernate.annotations.ColumnDefault;

import com.campforest.backend.user.model.Users;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notification_id")
	private Long notificationId;

	@ManyToOne
	@JoinColumn(name = "receiver")
	@JsonBackReference
	private Users receiver;

	@Column(name = "notification_type")
	@Enumerated(EnumType.STRING)
	private NotificationType notificationType;

	@Setter
	@Column(name = "is_read")
	@ColumnDefault(value = "false")
	private boolean isRead;

	@Column(name = "message")
	private String message;

	@Column(name = "created_at", nullable = false, updatable = false,
		insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdAt;
}

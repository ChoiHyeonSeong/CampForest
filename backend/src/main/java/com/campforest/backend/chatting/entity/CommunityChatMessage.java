package com.campforest.backend.chatting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "community_chat_messages")
public class CommunityChatMessage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "message_id")
	private Long messageId;
	@Column(name = "content")
	private String content;
	@Column(name = "sender_id")
	private Long senderId;

	@Column(name = "receiver_id")
	private Long receiverId;

	@Column(name = "room_id")
	private Long roomId;
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	@Column(name = "is_read")
	private boolean isRead;

	@Transient
	private String type;

	@Column(name = "is_deleted_for_sender")
	private boolean isDeletedForSender;

	@Column(name = "is_deleted_for_receiver")
	private boolean isDeletedForReceiver;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		isRead = false;
	}

}
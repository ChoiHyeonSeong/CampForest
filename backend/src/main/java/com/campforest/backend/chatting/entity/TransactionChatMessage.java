package com.campforest.backend.chatting.entity;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.ProductType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
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
@Table(name = "transaction_chat_message")
public class TransactionChatMessage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "message_id")
	private Long messageId;

	@Column(name = "sender_id")
	private Long senderId;

	@Column(name = "room_id")
	private Long roomId;

	@Column(name = "content")
	private String content;

	@Column(name = "message_type")
	@Enumerated(EnumType.STRING)
	private MessageType messageType;

	@Column(name = "is_read")
	private boolean isRead;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		isRead = false;
	}

}
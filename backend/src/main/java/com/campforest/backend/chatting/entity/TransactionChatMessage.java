package com.campforest.backend.chatting.entity;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.transaction.model.Sale;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder(toBuilder = true)
@Getter
@Setter
@ToString
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

	@Column(name = "receiver_id")
	private Long receiverId;

	@Column(name = "room_id")
	private Long roomId;

	@Column(name = "content")
	private String content;

	@Column(name = "is_read")
	private boolean isRead;

	@Enumerated(EnumType.STRING)
	private MessageType messageType;

	@Column(name = "transaction_id")
	private Long transactionId;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

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
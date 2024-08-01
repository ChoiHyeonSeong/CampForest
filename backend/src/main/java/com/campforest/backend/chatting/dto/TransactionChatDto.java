package com.campforest.backend.chatting.dto;

import com.campforest.backend.chatting.entity.MessageType;

import lombok.Data;

@Data
public class TransactionChatDto {
	private Long roomId;
	private Long sellerId;
	private Long buyerId;
	private Long productId;
	private MessageType messageType;
}

package com.campforest.backend.chatting.dto;


import lombok.Data;

@Data
public class TransactionChatDto {
	private Long roomId;
	private Long sellerId;
	private Long buyerId;
	private Long productId;
}

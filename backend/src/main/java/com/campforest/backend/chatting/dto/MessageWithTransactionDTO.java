package com.campforest.backend.chatting.dto;

import com.campforest.backend.chatting.entity.TransactionChatMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageWithTransactionDTO {

	private TransactionChatMessage message;
	private Object transactionEntity;
}

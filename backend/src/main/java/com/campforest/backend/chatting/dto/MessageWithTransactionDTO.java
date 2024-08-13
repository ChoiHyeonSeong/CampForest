package com.campforest.backend.chatting.dto;

import org.springframework.scheduling.annotation.Async;

import com.campforest.backend.chatting.entity.TransactionChatMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class MessageWithTransactionDTO {

	private TransactionChatMessage message;
	private Object transactionEntity;

}

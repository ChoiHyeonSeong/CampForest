package com.campforest.backend.chatting.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ChatHistoryDto {
	private List<MessageWithTransactionDTO> messages;
	private Long productId;
}

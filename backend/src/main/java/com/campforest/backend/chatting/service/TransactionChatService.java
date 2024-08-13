package com.campforest.backend.chatting.service;

import java.util.List;
import java.util.Optional;

import com.campforest.backend.chatting.dto.MessageWithTransactionDTO;
import com.campforest.backend.chatting.dto.TransactionChatDto;
import com.campforest.backend.chatting.dto.TransactionChatRoomListDto;
import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatRoom;

public interface TransactionChatService {
	 TransactionChatDto createOrGetChatRoom(Long productId, Long buyer, Long seller);

	TransactionChatMessage saveMessage(Long roomId, TransactionChatMessage message);

	List<MessageWithTransactionDTO> getChatHistory(Long roomId);

	Long getUnreadMessageCount(Long roomId, Long userId);

	void markMessagesAsRead(Long roomId, Long userId);

	public List<TransactionChatRoomListDto> getChatRoomsForUser(Long userId);

	Optional<TransactionChatRoom> getRoomById(Long roomId);

	Object getTransactionEntity(Long saleId);
}

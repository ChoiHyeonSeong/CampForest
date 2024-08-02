package com.campforest.backend.chatting.service;

import java.util.List;

import com.campforest.backend.chatting.dto.TransactionChatDto;
import com.campforest.backend.chatting.dto.TransactionChatRoomListDto;
import com.campforest.backend.chatting.entity.TransactionChatMessage;

public interface TransactionChatService {
	public TransactionChatDto createOrGetChatRoom(Long productId, Long buyer, Long seller);
	//
	TransactionChatMessage saveMessage(Long roomId, TransactionChatMessage message);
	//
	List<TransactionChatMessage> getChatHistory(Long roomId);
	//
	// Long getUnreadMessageCount(Long roomId, Long userId);
	//
	// void markMessagesAsRead(Long roomId, Long userId);
	//
	// public List<TransactionChatRoomListDto> getChatRoomsForUser(Long userId);
}

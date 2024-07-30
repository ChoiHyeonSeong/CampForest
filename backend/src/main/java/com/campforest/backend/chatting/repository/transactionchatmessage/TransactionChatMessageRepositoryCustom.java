package com.campforest.backend.chatting.repository.transactionchatmessage;

import java.util.List;

import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatMessage;

public interface TransactionChatMessageRepositoryCustom {


    List<TransactionChatMessage> findByChatRoom(Long roomId);

    Long countUnreadMessagesForUser(Long roomId, Long userId);

    List<TransactionChatMessage> findUnreadMessagesForUser(Long roomId, Long userId);


    TransactionChatMessage findTopByChatRoom_RoomIdOrderByCreatedAtDesc(Long roomId);
}

package com.campforest.backend.chatting.repository.transactionchatroom;

import java.util.List;

import com.campforest.backend.chatting.entity.CommunityChatRoom;
import com.campforest.backend.chatting.entity.TransactionChatRoom;

public interface TransactionChatRoomRepositoryCustom {
    TransactionChatRoom findOrCreateChatRoom(Long productId,Long user1Id, Long user2Id);
    // public Optional<CommunityChatRoom> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);
    //
    // List<TransactionChatRoom> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
}

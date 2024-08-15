package com.campforest.backend.chatting.repository.transactionchatroom;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.chatting.entity.CommunityChatRoom;
import com.campforest.backend.chatting.entity.TransactionChatRoom;

public interface TransactionChatRoomRepository extends JpaRepository<TransactionChatRoom,Long>,
	TransactionChatRoomRepositoryCustom {
}

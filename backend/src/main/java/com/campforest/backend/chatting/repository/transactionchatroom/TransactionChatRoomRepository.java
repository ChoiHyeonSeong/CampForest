package com.campforest.backend.chatting.repository.transactionchatroom;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.chatting.entity.CommunityChatRoom;

public interface TransactionChatRoomRepository extends JpaRepository<CommunityChatRoom,Long>,
	TransactionChatRoomRepositoryCustom {
}

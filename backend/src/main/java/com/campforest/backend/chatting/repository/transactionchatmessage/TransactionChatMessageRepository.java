package com.campforest.backend.chatting.repository.transactionchatmessage;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatMessage;

public interface TransactionChatMessageRepository extends JpaRepository<TransactionChatMessage,Long>,
	TransactionChatMessageRepositoryCustom {
}


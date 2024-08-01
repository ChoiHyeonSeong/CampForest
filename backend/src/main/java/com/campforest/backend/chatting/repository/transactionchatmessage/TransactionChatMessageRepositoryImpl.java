package com.campforest.backend.chatting.repository.transactionchatmessage;// package com.blog.chatting.repository.chatmessage;


import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.campforest.backend.chatting.entity.QTransactionChatMessage;
import com.campforest.backend.chatting.entity.QTransactionChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class TransactionChatMessageRepositoryImpl implements TransactionChatMessageRepositoryCustom{


	private final JPAQueryFactory queryFactory;
	QTransactionChatMessage transactionChatMessage = QTransactionChatMessage.transactionChatMessage;

	public TransactionChatMessageRepositoryImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public List<TransactionChatMessage> findByChatRoom(Long roomId) {

		return queryFactory
			.selectFrom(transactionChatMessage)
			.where(transactionChatMessage.roomId.eq(roomId))
			.orderBy(transactionChatMessage.createdAt.asc())
			.fetch();
	}

	@Override
	public Long countUnreadMessagesForUser(Long roomId, Long userId) {

		return  queryFactory
			.select(transactionChatMessage.count())
			.from(transactionChatMessage)
			.where(transactionChatMessage.roomId.eq(roomId)
				.and(transactionChatMessage.senderId.ne(userId))
				.and(transactionChatMessage.isRead.eq(false)))
			.fetchOne();
	}

	@Override
	public List<TransactionChatMessage> findUnreadMessagesForUser(Long roomId, Long userId) {

		return queryFactory
			.selectFrom(transactionChatMessage)
			.where(transactionChatMessage.roomId.eq(roomId)
				.and(transactionChatMessage.senderId.ne(userId))
				.and(transactionChatMessage.isRead.eq(false)))
			.fetch();
	}

	@Override
	public TransactionChatMessage findTopByChatRoom_RoomIdOrderByCreatedAtDesc(Long roomId) {
		QTransactionChatMessage message = QTransactionChatMessage.transactionChatMessage;

		TransactionChatMessage latestMessage = queryFactory
			.selectFrom(message)
			.where(message.roomId.eq(roomId))
			.orderBy(message.createdAt.desc())
			.fetchFirst();

		return latestMessage != null ? latestMessage : createEmptyMessage(roomId);
	}

	private TransactionChatMessage createEmptyMessage(Long roomId) {
		return TransactionChatMessage.builder()
			.roomId(roomId)
			.content("")
			.senderId(null)
			.createdAt(LocalDateTime.now())
			.build();
	}

}

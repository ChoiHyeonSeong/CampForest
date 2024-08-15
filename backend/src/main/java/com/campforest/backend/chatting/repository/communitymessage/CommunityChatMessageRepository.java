package com.campforest.backend.chatting.repository.communitymessage;


import java.util.List;

import com.campforest.backend.chatting.entity.CommunityChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import io.lettuce.core.dynamic.annotation.Param;

public interface CommunityChatMessageRepository extends JpaRepository<CommunityChatMessage,Long>, CommunityChatMessageRepositoryCustom {

	@Query("SELECT m FROM CommunityChatMessage m WHERE m.roomId = :roomId AND ((m.receiverId = :userId AND m.isDeletedForReceiver = false) OR (m.senderId = :userId AND m.isDeletedForSender = false))")
	List<CommunityChatMessage> findByRoomIdAndNotDeletedForUser(@Param("roomId") Long roomId, @Param("userId") Long userId);
}


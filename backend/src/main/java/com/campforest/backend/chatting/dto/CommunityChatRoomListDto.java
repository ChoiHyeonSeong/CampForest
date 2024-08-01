package com.campforest.backend.chatting.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CommunityChatRoomListDto {
	private Long roomId;
	private Long otherUserId;
	private String lastMessage;
	private LocalDateTime lastMessageTime;
	private Long unreadCount;
}
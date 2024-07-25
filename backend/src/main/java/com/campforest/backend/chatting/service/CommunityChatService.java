package com.campforest.backend.chatting.service;


import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;

import java.util.List;

public interface CommunityChatService {

    public CommunityChatDto createOrGetChatRoom(Long user1Id, Long user2Id);

    CommunityChatMessage saveMessage(Long roomId, CommunityChatMessage message);

    List<CommunityChatMessage> getChatHistory(Long roomId);

    Long getUnreadMessageCount(Long roomId, Long userId);
}

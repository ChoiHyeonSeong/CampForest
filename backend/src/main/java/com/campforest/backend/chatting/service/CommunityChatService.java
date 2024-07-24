package com.campforest.backend.chatting.service;


import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;

public interface CommunityChatService {

    public CommunityChatDto createOrGetChatRoom(Long user1Id, Long user2Id);

    CommunityChatMessage saveMessage(Long roomId, CommunityChatMessage message);
}

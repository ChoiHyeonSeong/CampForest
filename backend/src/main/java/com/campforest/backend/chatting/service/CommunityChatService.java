package com.campforest.backend.chatting.service;


import com.campforest.backend.chatting.dto.CommunityChatDto;

public interface CommunityChatService {

    public CommunityChatDto createOrGetChatRoom(Long user1Id, Long user2Id);

}

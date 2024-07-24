package com.campforest.backend.chatting.repository.communitychatroom;
import com.campforest.backend.chatting.entity.CommunityChatRoom;

public interface CommunityChatRoomRepositoryCustom {
    CommunityChatRoom findOrCreateChatRoom(Long user1Id, Long user2Id);

}

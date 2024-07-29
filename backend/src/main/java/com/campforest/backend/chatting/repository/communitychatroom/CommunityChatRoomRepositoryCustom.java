package com.campforest.backend.chatting.repository.communitychatroom;
import com.campforest.backend.chatting.entity.CommunityChatRoom;

import java.util.List;
import java.util.Optional;

public interface CommunityChatRoomRepositoryCustom {
    CommunityChatRoom findOrCreateChatRoom(Long user1Id, Long user2Id);
    // public Optional<CommunityChatRoom> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    List<CommunityChatRoom> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
}

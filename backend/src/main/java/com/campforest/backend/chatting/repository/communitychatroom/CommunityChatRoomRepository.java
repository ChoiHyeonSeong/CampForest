package com.campforest.backend.chatting.repository.communitychatroom;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.entity.CommunityChatRoom;

public interface CommunityChatRoomRepository extends JpaRepository<CommunityChatRoom,Long>,CommunityChatRoomRepositoryCustom {

}

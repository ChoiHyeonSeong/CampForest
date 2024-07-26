package com.campforest.backend.chatting.repository.communitymessage;


import com.campforest.backend.chatting.entity.CommunityChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityChatMessageRepository extends JpaRepository<CommunityChatMessage,Long>, CommunityChatMessageRepositoryCustom {
}


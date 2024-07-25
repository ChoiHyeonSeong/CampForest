package com.campforest.backend.chatting.repository.communitymessage;


import com.campforest.backend.chatting.entity.CommunityChatMessage;

import java.util.List;
import java.util.Optional;

public interface CommunityChatMessageRepositoryCustom {


    List<CommunityChatMessage> findByChatRoom(Long roomId);
}

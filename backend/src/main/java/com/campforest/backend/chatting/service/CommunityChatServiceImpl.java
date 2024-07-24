package com.campforest.backend.chatting.service;

import org.springframework.stereotype.Service;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.entity.CommunityChatRoom;
import com.campforest.backend.chatting.repository.communitychatroom.CommunityChatRoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityChatServiceImpl implements CommunityChatService {
    private final CommunityChatRoomRepository communityChatRoomRepository;
    @Transactional
    @Override
    public CommunityChatDto createOrGetChatRoom(Long user1Id, Long user2Id) {
        CommunityChatRoom room = communityChatRoomRepository.findOrCreateChatRoom(user1Id, user2Id);
        return convertToDto(room);
    }
    private CommunityChatDto convertToDto(CommunityChatRoom room) {
        CommunityChatDto dto = new CommunityChatDto();
        dto.setRoomId(room.getRoomId());
        dto.setUser1Id(room.getUser1());
        dto.setUser2Id(room.getUser2());
        return dto;
    }
}

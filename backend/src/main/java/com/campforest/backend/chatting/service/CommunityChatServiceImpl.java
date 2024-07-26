package com.campforest.backend.chatting.service;

import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.repository.communitymessage.CommunityChatMessageRepository;
import org.springframework.stereotype.Service;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.entity.CommunityChatRoom;
import com.campforest.backend.chatting.repository.communitychatroom.CommunityChatRoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityChatServiceImpl implements CommunityChatService {
    private final CommunityChatRoomRepository communityChatRoomRepository;
    private final CommunityChatMessageRepository communityChatMessageRepository;
    @Transactional
    @Override
    public CommunityChatDto createOrGetChatRoom(Long user1Id, Long user2Id) {
        CommunityChatRoom room = communityChatRoomRepository.findOrCreateChatRoom(user1Id, user2Id);
        return convertToDto(room);
    }

    @Transactional
    @Override
    public CommunityChatMessage saveMessage(Long roomId, CommunityChatMessage message) {
        CommunityChatRoom room = communityChatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        message= CommunityChatMessage.builder()
                .roomId(roomId)
                .content(message.getContent())
                .senderId(message.getSenderId())
                .build();
        return communityChatMessageRepository.save(message);
    }

    @Transactional
    @Override
    public List<CommunityChatMessage> getChatHistory(Long roomId) {
        return communityChatMessageRepository.findByChatRoom(roomId);
    }
    @Transactional
    @Override
    public Long getUnreadMessageCount(Long roomId, Long userId) {
        return communityChatMessageRepository.countUnreadMessagesForUser(roomId, userId);

    }

    @Transactional
    @Override
    public void markMessagesAsRead(Long roomId, Long userId) {
        List<CommunityChatMessage> unreadMessages = communityChatMessageRepository.findUnreadMessagesForUser(roomId, userId);
        unreadMessages.forEach(message -> message.setRead(true));
        communityChatMessageRepository.saveAll(unreadMessages);

        CommunityChatRoom chatRoom = communityChatRoomRepository.findById(roomId).orElseThrow();
        chatRoom.setUnreadCount(0L);
        communityChatRoomRepository.save(chatRoom);
    }

    private CommunityChatDto convertToDto(CommunityChatRoom room) {
        CommunityChatDto dto = new CommunityChatDto();
        dto.setRoomId(room.getRoomId());
        dto.setUser1Id(room.getUser1());
        dto.setUser2Id(room.getUser2());
        return dto;
    }
}

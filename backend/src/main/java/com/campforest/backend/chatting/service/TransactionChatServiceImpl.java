package com.campforest.backend.chatting.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.dto.TransactionChatDto;
import com.campforest.backend.chatting.dto.TransactionChatRoomListDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.entity.CommunityChatRoom;
import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatRoom;
import com.campforest.backend.chatting.repository.communitychatroom.CommunityChatRoomRepository;
import com.campforest.backend.chatting.repository.communitymessage.CommunityChatMessageRepository;
import com.campforest.backend.chatting.repository.transactionchatmessage.TransactionChatMessageRepository;
import com.campforest.backend.chatting.repository.transactionchatroom.TransactionChatRoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionChatServiceImpl implements TransactionChatService {
    private final TransactionChatRoomRepository transactionChatRoomRepository;
    private final TransactionChatMessageRepository transactionChatMessageRepository;
    @Transactional
    @Override
    public TransactionChatDto createOrGetChatRoom(Long productId, Long buyer, Long seller) {
        TransactionChatRoom room = transactionChatRoomRepository.findOrCreateChatRoom(productId, buyer, seller);
        return convertToDto(room);
    }

    @Transactional
    @Override
    public TransactionChatMessage saveMessage(Long roomId, TransactionChatMessage message) {
        TransactionChatRoom room = transactionChatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        message= TransactionChatMessage.builder()
                .content(message.getContent())
                .senderId(message.getSenderId())
                .roomId(roomId)
                .build();
        System.out.println(message.getContent()+message.getSenderId());
        return transactionChatMessageRepository.save(message);
    }

    @Transactional
    @Override
    public List<TransactionChatMessage> getChatHistory(Long roomId) {
        return transactionChatMessageRepository.findByChatRoom(roomId);
    }
    @Transactional
    @Override
    public Long getUnreadMessageCount(Long roomId, Long userId) {
        return transactionChatMessageRepository.countUnreadMessagesForUser(roomId, userId);

    }

    @Transactional
    @Override
    public void markMessagesAsRead(Long roomId, Long userId) {
        List<TransactionChatMessage> unreadMessages = transactionChatMessageRepository.findUnreadMessagesForUser(roomId, userId);
        unreadMessages.forEach(message -> message.setRead(true));
        transactionChatMessageRepository.saveAll(unreadMessages);

        TransactionChatRoom chatRoom = transactionChatRoomRepository.findById(roomId).orElseThrow();
        transactionChatRoomRepository.save(chatRoom);
    }
    @Override
    public List<TransactionChatRoomListDto> getChatRoomsForUser(Long userId) {
        List<TransactionChatRoom> rooms = transactionChatRoomRepository.findByUser1IdOrUser2Id(userId, userId);
        return rooms.stream().map(room -> {
            TransactionChatRoomListDto dto = convertToListDto(room,userId);
            dto.setUnreadCount(transactionChatMessageRepository.countUnreadMessagesForUser(room.getRoomId(), userId));
            return dto;
        }).collect(Collectors.toList());
    }
    private TransactionChatDto convertToDto(TransactionChatRoom room) {
        TransactionChatDto dto = new TransactionChatDto();
        dto.setRoomId(room.getRoomId());
        dto.setBuyerId(room.getBuyerId());
        dto.setSellerId(room.getSellerId());
        return dto;
    }


    private TransactionChatRoomListDto convertToListDto(TransactionChatRoom room, Long currentUserId) {
        TransactionChatRoomListDto dto = new TransactionChatRoomListDto();
        dto.setRoomId(room.getRoomId());


        Long otherUserId = room.getBuyerId().equals(currentUserId) ? room.getSellerId() : room.getBuyerId();
        dto.setOtherUserId(otherUserId);

        TransactionChatMessage lastMessage = getLastMessageForRoom(room.getRoomId());
        if (lastMessage != null) {
            dto.setLastMessage(lastMessage.getContent());
            dto.setLastMessageTime(lastMessage.getCreatedAt());
        }
        return dto;
    }
    //
    // // 마지막 메시지를 가져오기
    private TransactionChatMessage getLastMessageForRoom(Long roomId) {
        return transactionChatMessageRepository.findTopByChatRoom_RoomIdOrderByCreatedAtDesc(roomId);

    }
}

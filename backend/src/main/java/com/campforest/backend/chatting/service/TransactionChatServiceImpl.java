package com.campforest.backend.chatting.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.dto.TransactionChatDto;
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
                .roomId(roomId)
                .build();
        return transactionChatMessageRepository.save(message);
    }

    @Transactional
    @Override
    public List<TransactionChatMessage> getChatHistory(Long roomId) {
        return transactionChatMessageRepository.findByChatRoom(roomId);
    }
    // @Transactional
    // @Override
    // public Long getUnreadMessageCount(Long roomId, Long userId) {
    //     return communityChatMessageRepository.countUnreadMessagesForUser(roomId, userId);
    //
    // }

    // @Transactional
    // @Override
    // public void markMessagesAsRead(Long roomId, Long userId) {
    //     List<CommunityChatMessage> unreadMessages = communityChatMessageRepository.findUnreadMessagesForUser(roomId, userId);
    //     unreadMessages.forEach(message -> message.setRead(true));
    //     communityChatMessageRepository.saveAll(unreadMessages);
    //
    //     CommunityChatRoom chatRoom = communityChatRoomRepository.findById(roomId).orElseThrow();
    //     communityChatRoomRepository.save(chatRoom);
    // }
    // @Override
    // public List<CommunityChatRoomListDto> getChatRoomsForUser(Long userId) {
    //     List<CommunityChatRoom> rooms = communityChatRoomRepository.findByUser1IdOrUser2Id(userId, userId);
    //     return rooms.stream().map(room -> {
    //         CommunityChatRoomListDto dto = convertToListDto(room,userId);
    //         dto.setUnreadCount(communityChatMessageRepository.countUnreadMessagesForUser(room.getRoomId(), userId));
    //         return dto;
    //     }).collect(Collectors.toList());
    // }
    private TransactionChatDto convertToDto(TransactionChatRoom room) {
        TransactionChatDto dto = new TransactionChatDto();
        dto.setRoomId(room.getRoomId());
        dto.setBuyerId(room.getBuyerId());
        dto.setSellerId(room.getSellerId());
        return dto;
    }


    //
    //
    // private CommunityChatRoomListDto convertToListDto(CommunityChatRoom room, Long currentUserId) {
    //     CommunityChatRoomListDto dto = new CommunityChatRoomListDto();
    //     dto.setRoomId(room.getRoomId());
    //
    //     // 현재 사용자가 user1인지 user2인지 확인하고 그에 따라 otherUserId를 설정
    //     Long otherUserId = room.getUser1().equals(currentUserId) ? room.getUser2() : room.getUser1();
    //     dto.setOtherUserId(otherUserId);
    //
    //     CommunityChatMessage lastMessage = getLastMessageForRoom(room.getRoomId());
    //     if (lastMessage != null) {
    //         dto.setLastMessage(lastMessage.getContent());
    //         dto.setLastMessageTime(lastMessage.getCreatedAt());
    //     }
    //     return dto;
    // }
    //
    // // 마지막 메시지를 가져오는 메서드 (이 메서드는 별도로 구현해야 합니다)
    // private CommunityChatMessage getLastMessageForRoom(Long roomId) {
    //     return communityChatMessageRepository.findTopByChatRoom_RoomIdOrderByCreatedAtDesc(roomId);
    //
    // }
}

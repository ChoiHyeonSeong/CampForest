package com.campforest.backend.communitychat;

import com.campforest.backend.chatting.controller.CommunityChatController;
import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.service.CommunityChatService;
import com.campforest.backend.common.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommunityChatServiceTest {

    @InjectMocks
    private CommunityChatController communityChatController;

    @Mock
    private CommunityChatService communityChatService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateChatRoom() {
        Long user1Id = 1L;
        Long user2Id = 2L;
        CommunityChatDto chatDto = new CommunityChatDto();
        when(communityChatService.createOrGetChatRoom(user1Id, user2Id)).thenReturn(chatDto);

        ApiResponse<?> response = communityChatController.createChatRoom(user1Id, user2Id);
        assertNotNull(response);
        assertEquals("C000", response.getStatus());
        assertEquals("채팅방 생성 성공하였습니다", response.getMessage());
 }

    @Test
    void testSendMessage() {
        Long roomId = 1L;
        CommunityChatMessage message = new CommunityChatMessage();
        when(communityChatService.saveMessage(roomId, message)).thenReturn(message);

        CommunityChatMessage response = communityChatController.sendMessage(roomId, message);

        assertNotNull(response);
        assertEquals(message, response);
    }

    @Test
    void testGetChatHistory() {
        Long roomId = 1L;
        List<CommunityChatMessage> messages = new ArrayList<>();
        when(communityChatService.getChatHistory(roomId)).thenReturn(messages);

        ApiResponse<?> response = communityChatController.getChatHistory(roomId);

        assertNotNull(response);
        assertEquals("C000", response.getStatus());
        assertEquals("채팅 메시지 조회 성공", response.getMessage());
        assertEquals(messages, response.getData());
    }

    @Test
    void testMarkMessagesAsRead() {
        Long roomId = 1L;
        Long userId = 1L;

        ApiResponse<?> response = communityChatController.markMessagesAsRead(roomId, userId);

        assertNotNull(response);
        assertEquals("C000", response.getStatus());
        assertEquals("메시지를 읽음 처리 성공.", response.getMessage());
        verify(communityChatService, times(1)).markMessagesAsRead(roomId, userId);
    }

    @Test
    void testGetUnreadMessageCount() {
        Long roomId = 1L;
        Long userId = 1L;
        Long unreadCount = 5L;
        when(communityChatService.getUnreadMessageCount(roomId, userId)).thenReturn(unreadCount);

        ApiResponse<?> response = communityChatController.getUnreadMessageCount(roomId, userId);

        assertNotNull(response);
        assertEquals("C000", response.getStatus());
        assertEquals("읽지 않은 메시지 수를 가져오기 성공.", response.getMessage());
        assertEquals(unreadCount, response.getData());
    }

    @Test
    void testGetChatRoomsForUser() {
        Long userId = 1L;
        List<CommunityChatRoomListDto> rooms = new ArrayList<>();
        when(communityChatService.getChatRoomsForUser(userId)).thenReturn(rooms);

        ApiResponse<?> response = communityChatController.getChatRoomsForUser(userId);

        assertNotNull(response);
        assertEquals("C000", response.getStatus());
        assertEquals("채팅방 목록 가져오기 성공", response.getMessage());
        assertEquals(rooms, response.getData());
    }
}
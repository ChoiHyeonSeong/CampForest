package com.campforest.backend.chatting.controller;

import java.util.List;

import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.service.CommunityChatService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/communitychat")
@RequiredArgsConstructor
public class CommunityChatController {
    private final CommunityChatService communityChatService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/room")
    public ApiResponse<?> createChatRoom(@RequestParam Long user1,
                                        @RequestParam Long user2) {
        try {
        CommunityChatDto room = communityChatService.createOrGetChatRoom(user1, user2);
        return ApiResponse.createSuccessWithNoContent("채팅방 생성 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_ROOM_CREATION_FAILED);
        }
    }
    @MessageMapping("/{roomId}/send")
    @SendTo("/sub/community/{roomId}")
    public CommunityChatMessage sendMessage(@DestinationVariable Long roomId, @Payload CommunityChatMessage message) {

        return communityChatService.saveMessage(roomId, message);
    }
    @GetMapping("/room/{roomId}/messages")
    public  ApiResponse<?> getChatHistory(@PathVariable Long roomId) {
        try {
        List<CommunityChatMessage> messages = communityChatService.getChatHistory(roomId);
        return  ApiResponse.createSuccess(messages, "채팅 메시지 조회 성공");
        }catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_HISTORY_NOT_FOUND);
        }
    }

    //roomId에서 userId의 상대유저가 보낸메세지 읽음처리
    @PostMapping("/room/{roomId}/markAsRead")
    public ApiResponse<?> markMessagesAsRead(@PathVariable Long roomId, @RequestParam Long userId) {
        try {
        communityChatService.markMessagesAsRead(roomId, userId);
        return ApiResponse.createSuccessWithNoContent("메시지를 읽음 처리 성공.");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_MARK_READ_FAILED);
        }
    }
    //필요없을듯?
    @GetMapping("/room/{roomId}/unreadCount")
    public ApiResponse<?> getUnreadMessageCount(@PathVariable Long roomId, @RequestParam Long userId) {
       try {
        Long unreadCount = communityChatService.getUnreadMessageCount(roomId, userId);
        return ApiResponse.createSuccess(unreadCount, "읽지 않은 메시지 수를 가져오기 성공.");
       } catch (Exception e) {
        return ApiResponse.createError(ErrorCode.CHAT_UNREAD_COUNT_FAILED);
       }
    }

    //user가 속한 채팅방 목록 가져옴.
    // 각 채팅방 별 최근 메시지와, 안읽은 메세지 수 가져옴
    @GetMapping("/rooms")
    public ApiResponse<?> getChatRoomsForUser(@RequestParam Long userId) {
        try {
        List<CommunityChatRoomListDto> rooms = communityChatService.getChatRoomsForUser(userId);
        return ApiResponse.createSuccess(rooms,"채팅방 목록 가져오기 성공");
        }catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_ROOM_LIST_FAILED);
        }
    }

}
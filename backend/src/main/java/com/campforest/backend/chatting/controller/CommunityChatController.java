package com.campforest.backend.chatting.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.service.CommunityChatService;
import com.campforest.backend.common.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/communitychat")
@RequiredArgsConstructor
public class CommunityChatController {
    private final CommunityChatService communityChatService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/room")
    public ApiResponse<?> createChatRoom(@RequestParam Long user1Id,
                                                           @RequestParam Long user2Id) {
        CommunityChatDto room = communityChatService.createOrGetChatRoom(user1Id, user2Id);
        return ApiResponse.createSuccessWithNoContent("채팅방 생성 성공하였습니다");
    }
}
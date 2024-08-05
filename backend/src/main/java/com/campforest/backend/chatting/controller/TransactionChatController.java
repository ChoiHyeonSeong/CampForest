package com.campforest.backend.chatting.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.dto.TransactionChatDto;
import com.campforest.backend.chatting.dto.TransactionChatRoomListDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatRoom;
import com.campforest.backend.chatting.service.CommunityChatService;
import com.campforest.backend.chatting.service.TransactionChatService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactionchat")
public class TransactionChatController {
	private final TransactionChatService transactionChatService;
	private final SimpMessagingTemplate messagingTemplate;
	private final UserService userService;

	@PostMapping("/room")
	public ApiResponse<?> createChatRoom(
		Authentication authentication,
		@RequestParam Long productId,
		@RequestParam Long seller) {
		try {
			if (authentication == null) {
				return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
			}
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));
			Long buyer = user.getUserId();
			TransactionChatDto room = transactionChatService.createOrGetChatRoom(productId,buyer, seller);
			return ApiResponse.createSuccess(transactionChatService.getChatHistory(room.getRoomId()),"채팅방 생성 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_ROOM_CREATION_FAILED);
		}
	}
	@MessageMapping("/transaction/{roomId}/send")
	@SendTo("/sub/transaction/{roomId}")
	public TransactionChatMessage sendMessage(
		@DestinationVariable Long roomId,
		@Payload TransactionChatMessage message) {

		return transactionChatService.saveMessage(roomId, message);
	}
	@GetMapping("/room/{roomId}/messages")
	public  ApiResponse<?> getChatHistory(@PathVariable Long roomId) {
		try {
			List<TransactionChatMessage> messages = transactionChatService.getChatHistory(roomId);
			return  ApiResponse.createSuccess(messages, "채팅 메시지 조회 성공");
		}catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_HISTORY_NOT_FOUND);
		}
	}

	//roomId에서 userId의 상대유저가 보낸메세지 읽음처리
	@PostMapping("/room/{roomId}/markAsRead")
	public ApiResponse<?> markMessagesAsRead(
		Authentication authentication,
		@PathVariable Long roomId
	) {
		try {
			if (authentication == null) {
				return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
			}
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));
			Long nowId = user.getUserId();
			transactionChatService.markMessagesAsRead(roomId, nowId);
			return ApiResponse.createSuccessWithNoContent("메시지를 읽음 처리 성공.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_MARK_READ_FAILED);
		}
	}

	// //user가 속한 채팅방 목록 가져옴.
	// 각 채팅방 별 최근 메시지와, 안읽은 메세지 수 가져옴
	@GetMapping("/rooms")
	public ApiResponse<?> getChatRoomsForUser(Authentication authentication) {
		try {
			if (authentication == null) {
				return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
			}
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Long nowId = user.getUserId();
			List<TransactionChatRoomListDto> rooms = transactionChatService.getChatRoomsForUser(nowId);
			return ApiResponse.createSuccess(rooms,"채팅방 목록 가져오기 성공");
		}catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_ROOM_LIST_FAILED);
		}
	}
}

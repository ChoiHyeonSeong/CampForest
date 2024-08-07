package com.campforest.backend.chatting.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.campforest.backend.chatting.dto.MessageWithTransactionDTO;
import com.campforest.backend.chatting.entity.MessageType;
import com.campforest.backend.notification.model.Notification;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.service.ProductService;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentResponseDto;
import com.campforest.backend.transaction.dto.Sale.SaleRequestDto;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.repository.RentRepository;
import com.campforest.backend.transaction.repository.SaleRepository;
import com.campforest.backend.transaction.service.RentService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.board.dto.CreateRoomDto;
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
import com.campforest.backend.transaction.service.SaleService;
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
	private final RentService rentService;
	private final NotificationService notificationService;
	private final ProductService productService;
	private final SaleService saleService;
	private final RentRepository rentRepository;
	private final SaleRepository saleRepository;

	@PostMapping("/room")
	public ApiResponse<?> createChatRoom(
		Authentication authentication,
		@RequestBody CreateRoomDto createRoomDto) {
		try {
			if (authentication == null) {
				return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
			}
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));
			Long buyer = user.getUserId();
			TransactionChatDto room = transactionChatService.createOrGetChatRoom(createRoomDto.getProductId(),buyer, createRoomDto.getSeller());
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
			List<MessageWithTransactionDTO> messages = transactionChatService.getChatHistory(roomId);
			return  ApiResponse.createSuccess(messages, "채팅 메시지 조회 성공");
		}catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_HISTORY_NOT_FOUND);
		}
	}

	@MessageMapping("/transaction/{roomId}/markAsRead")
	public void markMessagesAsReadWebSocket(
			@DestinationVariable Long roomId,
			@Payload Long userId) {
		try {
			transactionChatService.markMessagesAsRead(roomId, userId);
			// 읽음 처리 완료를 클라이언트에게 알림
			messagingTemplate.convertAndSend("/sub/transaction/" + roomId + "/readStatus", userId);
		} catch (Exception e) {
			// 에러 처리
			messagingTemplate.convertAndSend("/sub/transaction/" + roomId + "/error", "메시지 읽음 처리 실패");
		}
	}

	//
	@MessageMapping("/transaction/{roomId}/{userId}/rentRequest")
	@SendTo("/sub/transaction/{roomId}/{userId}")
	public TransactionChatMessage sendRentRequest(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload RentRequestDto rentRequestDto
	) throws Exception {
		try {
			Long productId = rentRequestDto.getProductId();

			// 요청자 ID 설정
			rentRequestDto.setRequesterId(userId);

			// 대여 요청 처리
			Map<String, Long> result = rentService.rentRequest(rentRequestDto);
			Long receiverId = result.get("receiverId");
			Long requesterId = result.get("requesterId");
			Long rentId = result.get("rentId");
			Long reverseRentId = result.get("reverseRentId");

			// 요청자 정보 조회
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("요청자 정보 조회 실패"));

			// 수신자 정보 조회
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("수신자 정보 조회 실패"));

			// 알림 생성
			notificationService.createNotification(receiver, NotificationType.RENT,
				requester.getNickname() + "님이 대여예약을 요청하였습니다.");

			// 요청자에게 전송할 메시지 생성
			TransactionChatMessage requesterMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(rentId)
				.content("새로운 렌트 요청이 도착했습니다. 상품ID: " + productId + " 상품 이름: " + productService.getProduct(productId).getProductName())
				.build();
			transactionChatService.saveMessage(roomId, requesterMessage);

			// 수신자에게 전송할 메시지 생성
			TransactionChatMessage receiverMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(reverseRentId)
				.content("새로운 렌트 요청이 도착했습니다. 상품ID: " + productId + " 상품 이름: " + productService.getProduct(productId).getProductName())
				.build();
			transactionChatService.saveMessage(roomId, receiverMessage);

			// 요청자에게 전송할 메시지를 반환
			return requesterMessage;
		} catch (Exception e) {
			// 에러 처리
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 요청 처리 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return errorMessage;
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/saleRequest")
	@SendTo("/sub/transaction/{roomId}/{userId}")
	public TransactionChatMessage sendRentRequest(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) throws Exception {
		try {
			Long productId = saleRequestDto.getProductId();

			// 요청자 ID 설정
			saleRequestDto.setRequesterId(userId);

			// 대여 요청 처리
			Map<String, Long> result = saleService.saleRequest(saleRequestDto);
			Long receiverId = result.get("receiverId");
			Long requesterId = result.get("requesterId");
			Long rentId = result.get("rentId");
			Long reverseRentId = result.get("reverseRentId");

			// 요청자 정보 조회
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("요청자 정보 조회 실패"));

			// 수신자 정보 조회
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("수신자 정보 조회 실패"));

			// 알림 생성
			notificationService.createNotification(receiver, NotificationType.RENT,
				requester.getNickname() + "님이 대여예약을 요청하였습니다.");

			// 요청자에게 전송할 메시지 생성
			TransactionChatMessage requesterMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(rentId)
				.content("새로운 렌트 요청이 도착했습니다. 상품ID: " + productId + " 상품 이름: " + productService.getProduct(productId).getProductName())
				.build();
			transactionChatService.saveMessage(roomId, requesterMessage);

			// 수신자에게 전송할 메시지 생성
			TransactionChatMessage receiverMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(reverseRentId)
				.content("새로운 렌트 요청이 도착했습니다. 상품ID: " + productId + " 상품 이름: " + productService.getProduct(productId).getProductName())
				.build();
			transactionChatService.saveMessage(roomId, receiverMessage);

			// 요청자에게 전송할 메시지를 반환
			return requesterMessage;
		} catch (Exception e) {
			// 에러 처리
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 요청 처리 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return errorMessage;
		}
	}



	//

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

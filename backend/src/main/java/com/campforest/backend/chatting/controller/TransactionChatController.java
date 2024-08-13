package com.campforest.backend.chatting.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.chatting.dto.ChatHistoryDto;
import com.campforest.backend.chatting.dto.MessageWithTransactionDTO;
import com.campforest.backend.chatting.dto.RentableRequestDto;
import com.campforest.backend.chatting.entity.MessageType;
import com.campforest.backend.chatting.entity.TransactionChatRoom;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.service.ProductService;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentResponseDto;
import com.campforest.backend.transaction.dto.Sale.SaleRequestDto;
import com.campforest.backend.transaction.dto.Sale.SaleResponseDto;
import com.campforest.backend.transaction.repository.RentRepository;
import com.campforest.backend.transaction.repository.SaleRepository;
import com.campforest.backend.transaction.service.RentService;

import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.chatting.dto.CreateRoomDto;
import com.campforest.backend.chatting.dto.TransactionChatDto;
import com.campforest.backend.chatting.dto.TransactionChatRoomListDto;
import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.campforest.backend.chatting.service.TransactionChatService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.transaction.service.SaleService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
			TransactionChatDto room = transactionChatService.createOrGetChatRoom(createRoomDto.getProductId(), buyer,
				createRoomDto.getSeller());

			Users receiver = userService.findByUserId(createRoomDto.getSeller())
				.orElseThrow(() -> new IllegalArgumentException("사용자 조회 실패"));

			notificationService.createChatNotification(receiver, user, NotificationType.CHAT, "님과 채팅이 시작되었습니다.",
				room.getRoomId());

			return ApiResponse.createSuccess(room, "채팅방 생성 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_ROOM_CREATION_FAILED);
		}
	}

	@MessageMapping("/transaction/{roomId}/send")
	@SendTo("/sub/transaction/{roomId}")
	public TransactionChatMessage sendMessage(
		@DestinationVariable Long roomId,
		@Payload TransactionChatMessage message) {
		try {
			TransactionChatMessage savedMessage = transactionChatService.saveMessage(roomId, message);
			return savedMessage;
		} catch (Exception e) {
			// 로그 기록
			// 오류 메시지 반환
			TransactionChatMessage errorMessage = new TransactionChatMessage();
			errorMessage.setMessageType(MessageType.MESSAGE);
			errorMessage.setContent("메시지 저장 실패"+e);
			return errorMessage;
		}
	}
	@GetMapping("/room/{roomId}/messages")
	public ApiResponse<?> getChatHistory(@PathVariable Long roomId) {
		try {
			List<MessageWithTransactionDTO> messages = transactionChatService.getChatHistory(roomId);
			Long productId= transactionChatService.getRoomById(roomId).get().getProductId();
			ChatHistoryDto historyDto = new ChatHistoryDto();
			historyDto.setMessages(messages);
			historyDto.setProductId(productId);
			return ApiResponse.createSuccess(historyDto, "채팅 메시지 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_HISTORY_NOT_FOUND);
		}
	}


	@MessageMapping("/transaction/{roomId}/read")
	public void markMessagesAsReadWebSocket(
		@DestinationVariable Long roomId,
		@Payload Long userId) {
		try {
			transactionChatService.markMessagesAsRead(roomId, userId);
			TransactionChatMessage readMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.READ)
				.content("읽음")
				.build();
			messagingTemplate.convertAndSend("/sub/transaction/" + roomId, readMessage);

		} catch (Exception e) {
			TransactionChatMessage errorMessage = new TransactionChatMessage();
			errorMessage.setMessageType(MessageType.MESSAGE);
			errorMessage.setContent("읽음 에러 " + e);
			messagingTemplate.convertAndSend("/sub/transaction/" + roomId, errorMessage);
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
			return ApiResponse.createSuccess(rooms, "채팅방 목록 가져오기 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CHAT_ROOM_LIST_FAILED);
		}
	}

	@GetMapping("/rentable")
	public ApiResponse<?> getRentable(@RequestParam Long productId,
		@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate currentDate) {
		try {
			List<LocalDate> rentReservedDates = rentService.getRentAvailability(productId, currentDate);
			return ApiResponse.createSuccess(rentReservedDates, "대여 가능 기간 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_RESERVED_FAILED);
		}
	}

	////RENT 처리
	@MessageMapping("/transaction/{roomId}/{userId}/rentRequest")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO sendRentRequest(
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
			Long rentId = result.get("rentId");
			Long reverseRentId = result.get("reverseRentId");

			// 요청자 정보 조회
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("요청자 정보 조회 실패"));

			// 수신자 정보 조회
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("수신자 정보 조회 실패"));

			// 알림 생성
			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				"님이 대여예약을 요청하였습니다.");

			TransactionChatMessage requesterMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(rentId)
				.content("새로운 렌트 요청이 도착했습니다. 상품ID: " + productId + " 상품 이름: " + productService.getProduct(productId)
					.getProductName())
				.build();
			transactionChatService.saveMessage(roomId, requesterMessage);

			Object transactionEntity = null;
			transactionEntity = transactionChatService.getRentTransactionEntity(rentId);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(requesterMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 요청 중  오류가 발생했습니다: " + e)
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	//렌트 수락
	@MessageMapping("/transaction/{roomId}/{userId}/acceptRent")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO acceptRent(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload RentRequestDto rentRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = rentService.acceptRent(rentRequestDto, requester.getUserId());
			Long receiverId = map.get("receiverId");
			Long rentId = map.get("rentId");

			//여기서 리시버는 처음에 거래요청한 사람일듯
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				"님이 대여예약 요청을 수락하였습니다.");

			TransactionChatMessage acceptMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(rentId)
				.content(requester.getNickname() + "님이 대여예약 요청을 수락하였습니다. 대여 예약 됩니다.")
				.build();
			transactionChatService.saveMessage(roomId, acceptMessage);

			Object transactionEntity = null;
			transactionEntity = transactionChatService.getRentTransactionEntity(rentId);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(acceptMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 수락 중  오류가 발생했습니다: " + e)
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/denyRent")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO denyRent(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload RentRequestDto rentRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = rentService.denyRent(rentRequestDto, requester.getUserId());
			Long receiverId = map.get("receiverId");
			Long rentId = map.get("rentId");

			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(()-> new IllegalArgumentException("사용자 정보 없음"));

			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				requester.getNickname() + "님이 대여 요청을 거절하였습니다.");

			TransactionChatMessage denyMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(rentId)
				.content(requester.getNickname() + "님이 대여 요청을 거절하였습니다.")
				.build();
			transactionChatService.saveMessage(roomId, denyMessage);

			Object transactionEntity = null;
			transactionEntity = transactionChatService.getRentTransactionEntity(rentId);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(denyMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 거절 중  오류가 발생했습니다: " + e)
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}
	//

	@MessageMapping("/transaction/{roomId}/{userId}/confirmRent")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO confirmRent(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload RentRequestDto rentRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = rentService.confirmRent(rentRequestDto, requester.getUserId());
			Long receiverId = map.get("receiverId");
			Long rentId = map.get("rentId");

			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(()-> new IllegalArgumentException("사용자 정보 없음"));

			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				requester.getNickname() + "님이 대여 요청을 거절하였습니다.");

			TransactionChatMessage confirmMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(rentId)
				.content(requester.getNickname() + "님이 대여를 확정하였습니다.")
				.build();
			transactionChatService.saveMessage(roomId, confirmMessage);

			Object transactionEntity = null;
			transactionEntity = transactionChatService.getRentTransactionEntity(rentId);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(confirmMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 확정 중  오류가 발생했습니다: " + e)
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/getRent")
	@SendTo("/sub/transaction/{roomId}")
	public TransactionChatMessage getRent(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload RentRequestDto rentRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			RentResponseDto rentResponseDto = rentService.getRent(rentRequestDto, requester.getUserId());

			TransactionChatMessage getRentMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.content("거래 정보: " + rentResponseDto.toString())
				.build();
			transactionChatService.saveMessage(roomId, getRentMessage);

			return getRentMessage;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("거래 정보 조회 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return errorMessage;
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/updateRent")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO updateRentDate(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload RentRequestDto rentRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = rentService.update(rentRequestDto, requester.getUserId());
			Long rentId = map.get("rentId");
			//BUYER, product, time place seller
			TransactionChatMessage updateMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.content(requester.getNickname() + "님이 대여 날짜를 업데이트하였습니다.")
				.build();
			transactionChatService.saveMessage(roomId, updateMessage);

			Object transactionEntity = null;
			transactionEntity = transactionChatService.getRentTransactionEntity(rentId);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(updateMessage, transactionEntity);
			return messages;

		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("대여 날짜 업데이트 중 문제가 발생했습니다.: " + e)
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	// @MessageMapping("/transaction/public/rentable")
	// @SendTo("/sub/transaction/public/rentable")
	// public TransactionChatMessage getRentable(
	// 	@DestinationVariable Long roomId,
	// 	@Payload RentableRequestDto rentableRequestDto
	// ) {
	// 	try {
	// 		List<LocalDate> rentReservedDates = rentService.getRentAvailability(rentableRequestDto.getProductId(),
	// 			rentableRequestDto.getCurrentDate());
	//
	// 		TransactionChatMessage rentableMessage = TransactionChatMessage.builder()
	// 			.messageType(MessageType.TRANSACTION)
	// 			.content("대여 가능 기간: " + rentReservedDates.toString())
	// 			.build();
	// 		transactionChatService.saveMessage(roomId, rentableMessage);
	//
	// 		return rentableMessage;
	// 	} catch (Exception e) {
	// 		TransactionChatMessage errorMessage = TransactionChatMessage.builder()
	// 			.content("대여 가능 기간 조회 중 오류가 발생했습니다: " + e.getMessage())
	// 			.build();
	// 		return errorMessage;
	// 	}
	// }

	////////////////SALE

	//SALE 거래 요철
	@MessageMapping("/transaction/{roomId}/{userId}/saleRequest")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO sendSaleRequest(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) throws Exception {
		try {
			Long productId = saleRequestDto.getProductId();
			TransactionChatRoom room =transactionChatService.getRoomById(roomId)
				.orElseThrow (()->new Exception("방을 못찾았습니다"));
			// 요청자 ID 설정
			saleRequestDto.setRequesterId(userId);

			// 거래 요청 처리
			Map<String, Long> result = saleService.saleRequest(saleRequestDto);
			Long receiverId = result.get("receiverId");
			Long saleId = result.get("saleId");
			Long reverseSaleId = result.get("reverseSaleId");

			// 요청자 정보 조회
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("요청자 정보 조회 실패"));

			// 수신자 정보 조회
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("수신자 정보 조회 실패"));

			// 알림 생성
			notificationService.createNotification(receiver, requester, NotificationType.SALE,
				requester.getNickname() + "님이 판매를 요청하였습니다.");
			Object transactionEntity = null;
			 transactionEntity = transactionChatService.getSaleTransactionEntity(saleId);
			System.out.println("transation: "+transactionEntity.toString());
			TransactionChatMessage requesterMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(saleId)
				.content("새로운 판매 요청이 도착했습니다. 상품ID: " + productId + " 상품 이름: " + productService.getProduct(productId)
					.getProductName())
				.build();
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(requesterMessage, transactionEntity);
			System.out.println("message 1"+messages);
			System.out.println("message Test"+messages.toString());
			transactionChatService.saveMessage(roomId, requesterMessage);

			return messages;
		} catch (Exception e) {
			// 에러 처리
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("거래 요청 처리 중 오류가 발생했습니다: " + e)
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	//세일 수락
	@MessageMapping("/transaction/{roomId}/{userId}/acceptSale")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO acceptSale(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = saleService.acceptSale(saleRequestDto, requester.getUserId());
			Long receiverId = map.get("receiverId");
			Long saleId = map.get("saleId");
			System.out.println("accept res: "+receiverId+" sale: "+ saleId);
			//여기서 리시버는 처음에 거래요청한 사람일듯
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				requester.getNickname() + "님이 판매 요청을 수락하였습니다.");
			Object transactionEntity = null;
			transactionEntity = transactionChatService.getSaleTransactionEntity(saleId);

			System.out.println(saleRequestDto.toString());
			TransactionChatMessage acceptMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(saleId)
				.content(requester.getNickname() + "님이 판매 요청을 수락하였습니다.")
				.build();

			transactionChatService.saveMessage(roomId, acceptMessage);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(acceptMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("판매 요청 수락 중 오류가 발생했습니다: " + e.getMessage())
				.build();

			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/denySale")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO denySale(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = saleService.denySale(saleRequestDto, requester.getUserId());
			Long receiverId = map.get("receiverId");
			Long saleId = map.get("saleId");
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));
			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				requester.getNickname() + "님이 판매 요청을 거절하였습니다.");
			Object transactionEntity = null;
			transactionEntity = transactionChatService.getSaleTransactionEntity(saleId);

			TransactionChatMessage denyMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.transactionId(saleId)
				.content(requester.getNickname() + "님이 판매 요청을 거절하였습니다.")
				.build();
			transactionChatService.saveMessage(roomId, denyMessage);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(denyMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("판매 요청 거절 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}
	//

	@MessageMapping("/transaction/{roomId}/{userId}/confirmSale")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO confirmSale(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) {
		try {

				Users requester = userService.findByUserId(userId)
					.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

				Map<String, Long> map = saleService.confirmSale(saleRequestDto, requester.getUserId());
				Long receiverId = map.get("receiverId");
				Long saleId = map.get("saleId");
			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));
			notificationService.createNotification(receiver, requester, NotificationType.RENT,
				requester.getNickname() + "님이 거래를 완료하였습니다.");
			Object transactionEntity = null;
			transactionEntity = transactionChatService.getSaleTransactionEntity(saleId);

			TransactionChatMessage confirmMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.transactionId(saleId)
				.messageType(MessageType.TRANSACTION)
				.content(requester.getNickname() + "님이 거래를 완료하였습니다.")
				.build();
			transactionChatService.saveMessage(roomId, confirmMessage);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(confirmMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("거래 확정 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/getSale")
	@SendTo("/sub/transaction/{roomId}")
	public TransactionChatMessage getSale(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			SaleResponseDto saleResponseDto = saleService.getSale(saleRequestDto, requester.getUserId());
			System.out.println(saleResponseDto);
			TransactionChatMessage getRentMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.content("거래 정보: " + saleResponseDto.toString())
				.build();
			transactionChatService.saveMessage(roomId, getRentMessage);

			return getRentMessage;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("거래 정보 조회 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return errorMessage;
		}
	}

	@MessageMapping("/transaction/{roomId}/{userId}/updateSale")
	@SendTo("/sub/transaction/{roomId}")
	public MessageWithTransactionDTO updateMeetingTime(
		@DestinationVariable Long roomId,
		@DestinationVariable Long userId,
		@Payload SaleRequestDto saleRequestDto
	) {
		try {
			Users requester = userService.findByUserId(userId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = saleService.updateMeeting(saleRequestDto, requester.getUserId());
			Long saleId = map.get("saleId");

			TransactionChatMessage updateMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.messageType(MessageType.TRANSACTION)
				.content(requester.getNickname() + "님이 거래 날짜를 업데이트하였습니다.")
				.build();
			transactionChatService.saveMessage(roomId, updateMessage);

			Object transactionEntity = null;
			transactionEntity = transactionChatService.getSaleTransactionEntity(saleId);
			MessageWithTransactionDTO messages = new MessageWithTransactionDTO(updateMessage, transactionEntity);
			return messages;
		} catch (Exception e) {
			TransactionChatMessage errorMessage = TransactionChatMessage.builder()
				.roomId(roomId)
				.senderId(userId)
				.content("거래 날짜 업데이트 중 오류가 발생했습니다: " + e.getMessage())
				.build();
			return new MessageWithTransactionDTO(errorMessage, null);
		}
	}

}

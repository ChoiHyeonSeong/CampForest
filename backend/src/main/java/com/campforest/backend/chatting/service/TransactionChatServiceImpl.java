package com.campforest.backend.chatting.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import com.campforest.backend.chatting.dto.MessageWithTransactionDTO;
import com.campforest.backend.chatting.dto.RentDTO;
import com.campforest.backend.chatting.dto.SaleDTO;
import com.campforest.backend.chatting.dto.TransactionChatDto;
import com.campforest.backend.chatting.dto.TransactionChatRoomListDto;
import com.campforest.backend.chatting.entity.MessageType;
import com.campforest.backend.chatting.entity.TransactionChatMessage;
import com.campforest.backend.chatting.entity.TransactionChatRoom;
import com.campforest.backend.chatting.repository.transactionchatmessage.TransactionChatMessageRepository;
import com.campforest.backend.chatting.repository.transactionchatroom.TransactionChatRoomRepository;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.model.TransactionStatus;
import com.campforest.backend.transaction.repository.RentRepository;
import com.campforest.backend.transaction.repository.SaleRepository;
import com.campforest.backend.transaction.service.RentService;
import com.campforest.backend.transaction.service.SaleService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionChatServiceImpl implements TransactionChatService {
	private final TransactionChatRoomRepository transactionChatRoomRepository;
	private final TransactionChatMessageRepository transactionChatMessageRepository;
	private final ProductRepository productRepository;
	private final RentRepository rentRepository;
	private final SaleRepository saleRepository;
	private final UserRepository userRepository;
	private final RentService rentService;
	private final SaleService saleService;

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

		message.setRoomId(roomId);
		message.setReceiverId(
			room.getSellerId().equals(message.getSenderId()) ? room.getBuyerId() : room.getSellerId());

		if (room.isHidden()) {
			room.setHidden(false);
			transactionChatRoomRepository.save(room);
		}

		return transactionChatMessageRepository.save(message);
	}

	@Transactional
	@Override
	public List<MessageWithTransactionDTO> getChatHistory(Long roomId, Long userId) {
		TransactionChatRoom room = transactionChatRoomRepository.findById(roomId)
			.orElseThrow(() -> new RuntimeException("채팅룸 없습니다요"));
		List<TransactionChatMessage> messages = transactionChatMessageRepository.findByChatRoom(roomId);

		List<MessageWithTransactionDTO> filteredMessages = messages.stream()
			.filter(message -> {
				if (userId.equals(message.getSenderId())) {
					return !message.isDeletedForSender();
				} else if (!userId.equals(message.getReceiverId())) {
					return !message.isDeletedForReceiver();
				}
				return true;
			})
			.map(message -> {
				if (message.getMessageType() == MessageType.MESSAGE) {
					return new MessageWithTransactionDTO(message, null);
				} else {
					Object transactionEntity = null;
					if (room.getProductType() == ProductType.RENT) {
						transactionEntity = rentRepository.findById(message.getTransactionId()).orElse(null);
					} else if (room.getProductType() == ProductType.SALE) {
						transactionEntity = saleRepository.findById(message.getTransactionId()).orElse(null);
					}
					return new MessageWithTransactionDTO(message, transactionEntity);
				}
			})
			.collect(Collectors.toList());

		return filteredMessages;
	}

	@Transactional
	@Override
	public Long getUnreadMessageCount(Long roomId, Long userId) {
		return transactionChatMessageRepository.countUnreadMessagesForUser(roomId, userId);

	}

	@Transactional
	@Override
	public void markMessagesAsRead(Long roomId, Long userId) {
		List<TransactionChatMessage> unreadMessages = transactionChatMessageRepository.findUnreadMessagesForUser(roomId,
			userId);
		unreadMessages.forEach(message -> {
			message.setRead(true);
			if (message.getReceiverId().equals(userId) && !message.isDeletedForReceiver()) {
				message.setRead(true);
			}
		});
		transactionChatMessageRepository.saveAll(unreadMessages);

		TransactionChatRoom chatRoom = transactionChatRoomRepository.findById(roomId).orElseThrow();
		transactionChatRoomRepository.save(chatRoom);
	}

	@Override
	public List<TransactionChatRoomListDto> getChatRoomsForUser(Long userId) {
		List<TransactionChatRoom> rooms = transactionChatRoomRepository.findByUser1IdOrUser2Id(userId, userId);

		return rooms.stream().map(room -> {
				TransactionChatRoomListDto dto = convertToListDto(room, userId);
				Long productId = transactionChatRoomRepository.findProductIdByRoomId(room.getRoomId());
				Product product = productRepository.findById(productId)
					.orElseThrow(() -> new IllegalArgumentException("없는 판매용품입니다"));

				dto.setProductPrice(product.getProductPrice());
				dto.setProductName(product.getProductName());
				if (product.getProductImages().isEmpty()) {
					dto.setProductImage(null);
				} else {
					dto.setProductImage(product.getProductImages().get(0).getImageUrl());
				}

				dto.setProductId(productId);
				dto.setProductWriter(product.getUserId());
				dto.setHidden(room.isHidden());
				dto.setUnreadCount(transactionChatMessageRepository.countUnreadMessagesForUser(room.getRoomId(), userId));
				return dto;
			}).sorted(Comparator.comparing(TransactionChatRoomListDto::getLastMessageTime).reversed())
			.collect(Collectors.toList());
	}

	@Transactional
	@Override
	public void exitChatRoom(Long roomId, Long userId) {

		//만약 룸의 sale이나 렌트일떄
		TransactionChatRoom chatRoom = transactionChatRoomRepository.findById(roomId).orElseThrow();

		Long productId = chatRoom.getProductId();
		Long otherUserId = (userId.equals(chatRoom.getSellerId())) ? chatRoom.getBuyerId() : chatRoom.getSellerId();

		if (chatRoom.getProductType().equals(ProductType.RENT)) {
			Rent rent1 = rentRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(
				productId, userId, otherUserId).orElseThrow();

			if (rent1.getRentStatus() == TransactionStatus.REQUESTED ||
					rent1.getRentStatus() == TransactionStatus.RESERVED ||
				rent1.getRentStatus() == TransactionStatus.RECEIVED)
			{
				throw new IllegalStateException("채팅방 나가기 금지");
			}
		} else {
			Sale activeSale = saleRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(
				productId, userId, otherUserId).orElseThrow();

			if (activeSale.getSaleStatus() == TransactionStatus.REQUESTED ||
					activeSale.getSaleStatus() == TransactionStatus.RESERVED ||
				activeSale.getSaleStatus() == TransactionStatus.RECEIVED ) {
				throw new IllegalStateException("채팅방 나가기 금지");
			}
		}

		List<TransactionChatMessage> messages = transactionChatMessageRepository.findByChatRoom(roomId);
		for (TransactionChatMessage message : messages) {
			if(message.getSenderId().equals(userId)) {
				message.setDeletedForSender(true);
			} else if(message.getReceiverId().equals(userId)) {
				message.setDeletedForReceiver(true);
			}
		}
		chatRoom.setHidden(true);
		transactionChatRoomRepository.save(chatRoom);
		transactionChatMessageRepository.saveAll(messages);

	}

	@Transactional
	@Override
	public Optional<TransactionChatRoom> getRoomById(Long roomId) {
		return transactionChatRoomRepository.findById(roomId);
	}

	@Transactional
	@Override
	public Object getSaleTransactionEntity(Long saleId) {
		Sale sale = saleRepository.findById(saleId).orElseThrow();
		return toSaleDTO(sale);
	}

	@Transactional
	@Override
	public Object getRentTransactionEntity(Long rentId) {
		System.out.println(rentId);
		Rent rent = rentRepository.findById(rentId).orElseThrow();

		return toRentDto(rent);
	}

	private TransactionChatDto convertToDto(TransactionChatRoom room) {
		TransactionChatDto dto = new TransactionChatDto();
		dto.setProductId(room.getProductId());
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

	public SaleDTO toSaleDTO(Sale sale) {
		SaleDTO dto = new SaleDTO();
		dto.setId(sale.getId());
		dto.setProductId(sale.getProduct().getId());
		dto.setProductName(sale.getProduct().getProductName());
		dto.setBuyerId(sale.getBuyerId());
		dto.setSellerId(sale.getSellerId());
		dto.setRequesterId(sale.getRequesterId());
		dto.setReceiverId(sale.getReceiverId());
		dto.setSaleStatus(sale.getSaleStatus());
		dto.setCreatedAt(sale.getCreatedAt());
		dto.setModifiedAt(sale.getModifiedAt());
		dto.setMeetingTime(sale.getMeetingTime());
		dto.setMeetingPlace(sale.getMeetingPlace());
		dto.setConfirmedByBuyer(sale.isConfirmedByBuyer());
		dto.setConfirmedBySeller(sale.isConfirmedBySeller());
		dto.setRealPrice(sale.getRealPrice());
		dto.setLatitude(sale.getProduct().getLatitude());
		dto.setLongitude(sale.getProduct().getLongitude());
		return dto;
	}

	private RentDTO toRentDto(Rent rent) {
		RentDTO dto = new RentDTO();
		dto.setId(rent.getId());
		dto.setProductId(rent.getProduct().getId());
		dto.setProductName(rent.getProduct().getProductName());
		dto.setRenterId(rent.getRenterId());
		dto.setOwnerId(rent.getOwnerId());
		dto.setDeposit(rent.getDeposit());
		dto.setRentStartDate(rent.getRentStartDate());
		dto.setRentEndDate(rent.getRentEndDate());
		dto.setRequesterId(rent.getRequesterId());
		dto.setReceiverId(rent.getReceiverId());
		dto.setRentStatus(rent.getRentStatus());
		dto.setCreatedAt(rent.getCreatedAt());
		dto.setModifiedAt(rent.getModifiedAt());
		dto.setMeetingTime(rent.getMeetingTime());
		dto.setMeetingPlace(rent.getMeetingPlace());
		dto.setConfirmedByBuyer(rent.isConfirmedByBuyer());
		dto.setConfirmedBySeller(rent.isConfirmedBySeller());
		dto.setRealPrice(rent.getRealPrice());
		dto.setLatitude(rent.getProduct().getLatitude());
		dto.setLongitude(rent.getProduct().getLongitude());
		return dto;
	}
}

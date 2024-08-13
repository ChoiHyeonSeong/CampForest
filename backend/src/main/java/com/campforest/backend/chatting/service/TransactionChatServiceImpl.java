package com.campforest.backend.chatting.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.repository.RentRepository;
import com.campforest.backend.transaction.repository.SaleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionChatServiceImpl implements TransactionChatService {
    private final TransactionChatRoomRepository transactionChatRoomRepository;
    private final TransactionChatMessageRepository transactionChatMessageRepository;
    private final RentRepository rentRepository;
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

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
        message.setRoomId(room.getRoomId());
        return transactionChatMessageRepository.save(message);
    }

    @Transactional
    @Override
    public List<MessageWithTransactionDTO> getChatHistory(Long roomId) {
        TransactionChatRoom room = transactionChatRoomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("채팅룸 없습니다요"));
        List<TransactionChatMessage> messages = transactionChatMessageRepository.findByChatRoom(roomId);
        System.out.println(messages.toString());
        return messages.stream()
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
            dto.setProductId(transactionChatRoomRepository.findProductIdByRoomId(room.getRoomId()));
            dto.setUnreadCount(transactionChatMessageRepository.countUnreadMessagesForUser(room.getRoomId(), userId));
            return dto;
        }).collect(Collectors.toList());
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

    @Override
    public Object getRentTransactionEntity(Long rentId) {
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

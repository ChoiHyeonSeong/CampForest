package com.campforest.backend.transaction.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentResponseDto;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.TransactionStatus;
import com.campforest.backend.transaction.repository.RentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentService {

	private final RentRepository rentRepository;
	private final ProductRepository productRepository;
	private final NotificationService notificationService;

	@Transactional
	public Map<String, Long> rentRequest(RentRequestDto rentRequestDto) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));



		Map<String, Long> result = new HashMap<>();
		Long requesterId = rentRequestDto.getRequesterId();
		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		if(!validateDuplicateRequest(rentRequestDto,receiverId)){
			return null;
		}
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);

		Rent rent = buildRent(rentRequestDto, product, requesterId, receiverId, TransactionStatus.REQUESTED);
		rent.requestRent();
		rentRepository.save(rent);

		Rent reverseRent = reverseBuildRent(rentRequestDto, product, receiverId, requesterId, TransactionStatus.RECEIVED);
		reverseRent.receiveRent();
		rentRepository.save(reverseRent);

		result.put("rentId", rent.getId());
		result.put("reverseRentId", reverseRent.getId());

		return result;
	}

	@Transactional
	public Map<String, Long> acceptRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Long rentId = 0L;

		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);
		for(Rent rent : rents) {
			if(rent.getRentStatus().equals(TransactionStatus.RECEIVED)) {
				rentId = rent.getId();
			}
		}
		rents[0].acceptRent();
		rents[1].acceptRent();

		Map<String, Long> result = new HashMap<>();
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);
		result.put("rentId", rentId);

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);

		return result;
	}

	@Transactional
	public Map<String, Long> denyRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Long rentId = 0L;
		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);

		for(Rent rent : rents) {
			if(rent.getRentStatus().equals(TransactionStatus.RECEIVED)) {
				rentId = rent.getId();
			}
		}
		rents[0].denyRent();
		rents[1].denyRent();

		Map<String, Long> result = new HashMap<>();
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);
		result.put("rentId", rentId);

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);

		return result;
	}

	@Transactional
	public Map<String, Long> confirmRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Long rentId = 0L;
		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);

		for(Rent rent : rents) {
			if(rent.getRentStatus().equals(TransactionStatus.RESERVED)) {
				rentId = rent.getId();
			}
		}

		boolean isRequesterOwner = requesterId.equals(rentRequestDto.getOwnerId());
		rents[0].confirmRent(isRequesterOwner); // 소유자가 요청자일 경우
		rents[1].confirmRent(isRequesterOwner); // 소유자가 아닌 경우

		Rent rent = rentRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(rentRequestDto.getProductId(),
			requesterId,receiverId)
			.orElseThrow(()-> new IllegalArgumentException("찾을 수 없는 대여요청입니다."));
		rent.confirmRentStatus();

		if (rents[0].isFullyConfirmed() && rents[1].isFullyConfirmed()) {
			productRepository.save(product);
		}

		Map<String, Long> result = new HashMap<>();
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);
		result.put("rentId", rentId);

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);
		return result;
	}

	public RentResponseDto getRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Rent rent = rentRepository.findByProductIdAndRequesterIdAndReceiverId(
				rentRequestDto.getProductId(), requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("없다요"));

		return new RentResponseDto(rent);
	}

	public List<LocalDate> getRentAvailability(Long productId, LocalDate currentDate) {

		LocalDateTime startOfDay = currentDate.atStartOfDay();

		List<Rent> reservedRent = rentRepository.findReservedRents(productId, startOfDay);

		Set<LocalDate> uniqueDates = new TreeSet<>();// TreeSet을 사용하여 날짜를 정렬된 상태로 유지

		for(Rent rent : reservedRent) {
			if(rent.getRentStatus().equals(TransactionStatus.RESERVED)) {
				LocalDate start = rent.getRentStartDate().toLocalDate();
				LocalDate end = rent.getRentEndDate().toLocalDate();

				// start부터 end까지의 모든 날짜를 Set에 추가
				start.datesUntil(end.plusDays(1)).forEach(uniqueDates::add);
			}
		}

		// Set을 List로 변환하여 반환
		return new ArrayList<>(uniqueDates);
	}

	public Map<String, Long> update(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);

		if (rents[0].getRentStatus() == TransactionStatus.CONFIRMED
			|| rents[1].getRentStatus() == TransactionStatus.CONFIRMED) {
			throw new IllegalArgumentException("거래 상태가 CONFIRMED입니다. 날짜를 수정할 수 없습니다.");
		}

		rents[0].setRentStartDate(rentRequestDto.getRentStartDate());
		rents[0].setRentEndDate(rentRequestDto.getRentEndDate());
		rents[1].setRentStartDate(rentRequestDto.getRentStartDate());
		rents[1].setRentEndDate(rentRequestDto.getRentEndDate());

		rents[0].setMeetingTime(rentRequestDto.getMeetingTime());
		rents[1].setMeetingTime(rentRequestDto.getMeetingTime());

		rents[0].setMeetingPlace(rentRequestDto.getMeetingPlace());
		rents[1].setMeetingPlace(rentRequestDto.getMeetingPlace());

		rents[0].setLongitude(rentRequestDto.getLongitude());
		rents[1].setLongitude(rentRequestDto.getLongitude());

		rents[0].setLatitude(rentRequestDto.getLatitude());
		rents[1].setLatitude(rentRequestDto.getLatitude());

		Rent rent = rentRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(rentRequestDto.getProductId(),
			requesterId, receiverId)
				.orElseThrow(() -> new IllegalArgumentException("없습니다"));

		Map<String, Long> result = new HashMap<>();
		result.put("rentId", rent.getId());

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);
		return result;
	}

	private boolean validateDuplicateRequest(RentRequestDto rentRequestDto, Long receiverId) {
		List<Rent> rentList= rentRepository.findByProductIdAndRequesterId(rentRequestDto.getProductId(), rentRequestDto.getRequesterId());

		for (Rent rent : rentList) {
			if(!rent.getRentStatus().equals(TransactionStatus.REQUESTED)&&(!rent.getRentStatus().equals(TransactionStatus.RECEIVED))) {
				return false;
			}
		}
		List<Rent> rentList2= rentRepository.findByProductIdAndRequesterId(rentRequestDto.getProductId(),receiverId);
		for (Rent rent : rentList2) {
			if(!rent.getRentStatus().equals(TransactionStatus.REQUESTED)&&(!rent.getRentStatus().equals(TransactionStatus.RECEIVED))) {
				return false;
			}
		}
			return true;
	}

	private Rent buildRent(RentRequestDto rentRequestDto, Product product, Long requesterId, Long receiverId,
		TransactionStatus status) {
		return Rent.builder()
			.product(product)
			.renterId(rentRequestDto.getRenterId())
			.requesterId(requesterId)
			.receiverId(receiverId)
			.ownerId(rentRequestDto.getOwnerId())
			.rentStatus(status)
			.rentStartDate(rentRequestDto.getRentStartDate())
			.rentEndDate(rentRequestDto.getRentEndDate())
			.deposit(rentRequestDto.getDeposit())
			.meetingTime(rentRequestDto.getMeetingTime())
			.meetingPlace(rentRequestDto.getMeetingPlace())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.realPrice(rentRequestDto.getRealPrice())
			.longitude(rentRequestDto.getLongitude())
			.latitude(rentRequestDto.getLatitude())
			.build();
	}

	private Rent reverseBuildRent(RentRequestDto rentRequestDto, Product product, Long receiverId, Long requesterId,
		TransactionStatus status) {
		return Rent.builder()
			.product(product)
			.renterId(rentRequestDto.getRenterId())
			.requesterId(receiverId)
			.receiverId(requesterId)
			.ownerId(rentRequestDto.getOwnerId())
			.rentStatus(status)
			.rentStartDate(rentRequestDto.getRentStartDate())
			.rentEndDate(rentRequestDto.getRentEndDate())
			.deposit(rentRequestDto.getDeposit())
			.meetingTime(rentRequestDto.getMeetingTime())
			.meetingPlace(rentRequestDto.getMeetingPlace())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.realPrice(rentRequestDto.getRealPrice())
			.longitude(rentRequestDto.getLongitude())
			.latitude(rentRequestDto.getLatitude())
			.build();
	}

	private Long determineReceiverId(Product product, Long requesterId, RentRequestDto rentRequestDto) {
		return requesterId.equals(product.getUserId()) ? rentRequestDto.getRenterId(): rentRequestDto.getOwnerId() ;
	}

	private Rent[] getRents(RentRequestDto rentRequestDto, Long requesterId, Long receiverId) {
		Rent rent1 = rentRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(rentRequestDto.getProductId(),
				requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 대여 요청 입니다."));
		Rent rent2 = rentRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(rentRequestDto.getProductId(),
				receiverId, requesterId)
			.orElseThrow(() -> new IllegalArgumentException("상대방 요청을 찾을 수 없습니다."));
		return new Rent[] {rent1, rent2};
	}


}

package com.campforest.backend.transaction.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentResponseDto;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.TransactionStatus;
import com.campforest.backend.transaction.repository.RentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RentService {

	private final RentRepository rentRepository;
	private final ProductRepository productRepository;

	@Transactional
	public void rentRequest(RentRequestDto rentRequestDto) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		validateDuplicateRequest(rentRequestDto);

		Long requesterId = rentRequestDto.getRequesterId();
		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Rent rent = buildRent(rentRequestDto, product, requesterId, receiverId, TransactionStatus.REQUESTED);
		rent.requestRent();
		rentRepository.save(rent);

		Rent reverseRent = buildRent(rentRequestDto, product, receiverId, requesterId, TransactionStatus.RECEIVED);
		reverseRent.receiveRent();
		rentRepository.save(reverseRent);
	}

	@Transactional
	public void acceptRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);

		rents[0].acceptRent();
		rents[1].acceptRent();

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);
	}

	@Transactional
	public void denyRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);

		rentRepository.delete(rents[0]);
		rentRepository.delete(rents[1]);
	}

	@Transactional
	public void confirmRent(RentRequestDto rentRequestDto, Long requesterId) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, rentRequestDto);

		Rent[] rents = getRents(rentRequestDto, requesterId, receiverId);

		boolean isRequesterOwner = requesterId.equals(product.getUserId());

		rents[0].confirmRent(isRequesterOwner ? "owner" : "renter");
		rents[1].confirmRent(isRequesterOwner ? "renter" : "owner");

		if (rents[0].isFullyConfirmed() && rents[1].isFullyConfirmed()) {
			rents[0].setRentStatus(TransactionStatus.CONFIRMED);
			rents[1].setRentStatus(TransactionStatus.CONFIRMED);

			productRepository.save(product);
		}

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);
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
		List<Rent> reservedRent = rentRepository.findByProductIdAndRentStartDateAfter(productId, currentDate);

		return reservedRent.stream()
			.flatMap(rent -> rent.getRentStartDate()
				.toLocalDate()
				.datesUntil(rent.getRentEndDate().toLocalDate().plusDays(1)))
			.collect(Collectors.toList());
	}

	public void update(RentRequestDto rentRequestDto, Long requesterId) {
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

		rentRepository.save(rents[0]);
		rentRepository.save(rents[1]);
	}

	private void validateDuplicateRequest(RentRequestDto rentRequestDto) {
		rentRepository.findByProductIdAndRequesterId(rentRequestDto.getProductId(), rentRequestDto.getRequesterId())
			.ifPresent(rent -> {
				throw new RuntimeException("이미 대여 요청을 보냈습니다.");
			});
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
			.build();
	}

	private Long determineReceiverId(Product product, Long requesterId, RentRequestDto rentRequestDto) {
		return requesterId.equals(product.getUserId()) ? rentRequestDto.getRenterId() : product.getUserId();
	}

	private Rent[] getRents(RentRequestDto rentRequestDto, Long requesterId, Long receiverId) {
		Rent rent1 = rentRepository.findByProductIdAndRequesterIdAndReceiverId(rentRequestDto.getProductId(),
				requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 대여 요청 입니다."));
		Rent rent2 = rentRepository.findByProductIdAndRequesterIdAndReceiverId(rentRequestDto.getProductId(),
				receiverId, requesterId)
			.orElseThrow(() -> new IllegalArgumentException("상대방 요청을 찾을 수 없습니다."));
		return new Rent[] {rent1, rent2};
	}

}

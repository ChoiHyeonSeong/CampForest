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

	//판매 요청
	@Transactional
	public void rentRequest(RentRequestDto rentRequestDto) {
		Product product = productRepository.findById(rentRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		rentRepository.findByProductIdAndRenterId(rentRequestDto.getProductId(), rentRequestDto.getRenterId())
			.ifPresent(rent -> {
				throw new RuntimeException("이미 구매 요청을 보냈습니다.");
			});

		if (rentRequestDto.getRequesterId().equals(product.getUserId())) {
			throw new RuntimeException("자기 자신에게 구매 요청을 보낼 수 없습니다.");
		}

		Rent rent = Rent.builder()
			.product(product)
			.renterId(rentRequestDto.getRenterId())
			.requesterId(rentRequestDto.getRequesterId())
			.ownerId(rentRequestDto.getOwnerId())
			.rentStatus(TransactionStatus.REQUESTED)
			.rentEndDate(rentRequestDto.getRentEndDate())
			.rentStartDate(rentRequestDto.getRentStartDate())
			.deposit(rentRequestDto.getDeposit())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
		rent.requestRent();

		Rent savedRent = rentRepository.save(rent);

		// 역방향 요청 생성 및 저장
		Rent reverserent = rent.toEntityInverse();
		reverserent.receiveRent();
		Rent savedReverseRent = rentRepository.save(reverserent);
	}

	//판매 승낙 후 -> 예약
	@Transactional
	public void acceptRent(RentRequestDto rentRequestDto) {

		//두 개의 요청 다 가져오기
		Rent rent1 = rentRepository.findRentByRenterIdAndOwnerId(rentRequestDto.getRenterId(),
				rentRequestDto.getOwnerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Rent rent2 = rentRepository.findRentByRenterIdAndOwnerId(rentRequestDto.getOwnerId(),
				rentRequestDto.getRenterId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		rent1.acceptRent();
		rent2.acceptRent();

		rentRepository.save(rent1);
		rentRepository.save(rent2);
	}

	//판매 거절
	public void denyRent(RentRequestDto rentRequestDto) {

		//두 개의 요청 다 가져오기
		Rent rent1 = rentRepository.findRentByRenterIdAndOwnerId(rentRequestDto.getRenterId(),
				rentRequestDto.getOwnerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Rent rent2 = rentRepository.findRentByRenterIdAndOwnerId(rentRequestDto.getOwnerId(),
				rentRequestDto.getRenterId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		rentRepository.delete(rent1);
		rentRepository.delete(rent2);
	}

	@Transactional
	public void confirmRent(RentRequestDto rentRequestDto) {

		Rent rent = rentRepository.findRentByRenterIdAndOwnerId(rentRequestDto.getRenterId(), rentRequestDto.getOwnerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		Rent reverserent = rentRepository.findRentByRenterIdAndOwnerId(rentRequestDto.getOwnerId(), rentRequestDto.getRenterId())
			.orElseThrow(() -> new IllegalArgumentException("상대방 요청을 찾을 수 없습니다."));

		rent.confirmRent(rentRequestDto.getRequestRole());
		reverserent.confirmRent(rentRequestDto.getRequestRole().equals("buyer") ? "seller" : "buyer");

		if (rent.isFullyConfirmed() && reverserent.isFullyConfirmed()) {
			rent.setRentStatus(TransactionStatus.CONFIRMED);
			reverserent.setRentStatus(TransactionStatus.CONFIRMED);

			Product product = rent.getProduct();
			product.setSold(true);
			productRepository.save(product);
		}

		rentRepository.save(rent);
		rentRepository.save(reverserent);
	}

	public RentResponseDto getRent(RentRequestDto rentRequestDto) {
		Rent rent = rentRepository.findByProductIdAndRenterIdAndOwnerId(rentRequestDto.getProductId(),
				rentRequestDto.getRenterId(), rentRequestDto.getOwnerId())
			.orElseThrow(() ->  new IllegalArgumentException("없다요"));

		return new RentResponseDto(rent);
	}

	public List<LocalDate> getRentAvailability(Long productId, LocalDate currentDate) {

		List<Rent> reservedRent = rentRepository.findByProductIdAndRentStartDateAfter(productId,
			currentDate);

		return reservedRent.stream()
			.flatMap(rent -> rent.getRentStartDate().toLocalDate().datesUntil(rent.getRentEndDate().toLocalDate().plusDays(1)))
			.collect(Collectors.toList());
	}
}

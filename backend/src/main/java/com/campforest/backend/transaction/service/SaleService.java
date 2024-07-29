package com.campforest.backend.transaction.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.transaction.dto.Sale.SaleRequestDto;
import com.campforest.backend.transaction.dto.Sale.SaleResponseDto;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.model.TransactionStatus;
import com.campforest.backend.transaction.repository.SaleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

	private final ProductRepository productRepository;
	private final SaleRepository saleRepository;

	@Transactional
	public void saleRequest(SaleRequestDto saleRequestDto) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		validateDuplicateRequest(saleRequestDto);

		Sale sale = buildSale(saleRequestDto, product, saleRequestDto.getRequesterId(), saleRequestDto.getReceiverId(),
			TransactionStatus.REQUESTED, saleRequestDto.getMeetingTime());
		sale.requestSale();
		saleRepository.save(sale);

		Sale reverseSale = buildSale(saleRequestDto, product, saleRequestDto.getReceiverId(),
			saleRequestDto.getRequesterId(), TransactionStatus.RECEIVED, saleRequestDto.getMeetingTime());
		reverseSale.receiveSale();
		saleRepository.save(reverseSale);
	}

	@Transactional
	public void acceptSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		sales[0].acceptSale();
		sales[1].acceptSale();

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);
	}

	@Transactional
	public void denySale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		saleRepository.delete(sales[0]);
		saleRepository.delete(sales[1]);
	}

	@Transactional
	public void confirmSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		boolean isRequesterSeller = requesterId.equals(product.getUserId());

		sales[0].confirmSale(isRequesterSeller ? "seller" : "buyer");
		sales[1].confirmSale(isRequesterSeller ? "buyer" : "seller");

		if (sales[0].isFullyConfirmed() && sales[1].isFullyConfirmed()) {
			sales[0].setSaleStatus(TransactionStatus.CONFIRMED);
			sales[1].setSaleStatus(TransactionStatus.CONFIRMED);

			product.setSold(true);
			productRepository.save(product);
		}

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);
	}

	public SaleResponseDto getSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		Sale sale = saleRepository.findByProductIdAndRequesterIdAndReceiverId(
				saleRequestDto.getProductId(), requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("없다요"));

		return new SaleResponseDto(sale);
	}

	@Transactional
	public void updateMeeting(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		// 판매 상태가 CONFIRMED인지 확인
		if (sales[0].getSaleStatus() == TransactionStatus.CONFIRMED
			|| sales[1].getSaleStatus() == TransactionStatus.CONFIRMED) {
			throw new IllegalArgumentException("거래 상태가 CONFIRM입니다. 약속 시간을 수정할 수 없습니다.");
		}

		sales[0].setMeetingTime(saleRequestDto.getMeetingTime());
		sales[1].setMeetingTime(saleRequestDto.getMeetingTime());
		sales[0].setMeetingPlace(saleRequestDto.getMeetingPlace());
		sales[1].setMeetingPlace(saleRequestDto.getMeetingPlace());

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);
	}

	private void validateDuplicateRequest(SaleRequestDto saleRequestDto) {
		saleRepository.findByProductIdAndRequesterId(saleRequestDto.getProductId(), saleRequestDto.getRequesterId())
			.ifPresent(sale -> {
				throw new RuntimeException("이미 구매 요청을 보냈습니다.");
			});
	}

	private Sale buildSale(SaleRequestDto saleRequestDto, Product product, Long requesterId, Long receiverId,
		TransactionStatus status, LocalDateTime meetingTime) {
		return Sale.builder()
			.product(product)
			.requesterId(requesterId)
			.receiverId(receiverId)
			.sellerId(saleRequestDto.getSellerId())
			.buyerId(saleRequestDto.getBuyerId())
			.saleStatus(status)
			.meetingTime(meetingTime)
			.meetingPlace(saleRequestDto.getMeetingPlace())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
	}

	private Long determineReceiverId(Product product, Long requesterId, SaleRequestDto saleRequestDto) {
		return requesterId.equals(product.getUserId()) ? saleRequestDto.getBuyerId() : product.getUserId();
	}

	private Sale[] getSales(SaleRequestDto saleRequestDto, Long requesterId, Long receiverId) {
		Sale sale1 = saleRepository.findByProductIdAndRequesterIdAndReceiverId(saleRequestDto.getProductId(),
				requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Sale sale2 = saleRepository.findByProductIdAndRequesterIdAndReceiverId(saleRequestDto.getProductId(),
				receiverId, requesterId)
			.orElseThrow(() -> new IllegalArgumentException("상대방 요청을 찾을 수 없습니다."));
		return new Sale[] {sale1, sale2};
	}

}

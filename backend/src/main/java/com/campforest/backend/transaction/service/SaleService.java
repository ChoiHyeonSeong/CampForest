package com.campforest.backend.transaction.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
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
	public Map<String, Long> saleRequest(SaleRequestDto saleRequestDto) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Map<String, Long> result = new HashMap<>();
		Long requesterId = saleRequestDto.getRequesterId();
		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);

		Sale sale = buildSale(saleRequestDto, product, requesterId, receiverId, TransactionStatus.REQUESTED);
		sale.requestSale();
		saleRepository.save(sale);

		Sale reverseSale = reverseBuildSale(saleRequestDto, product, receiverId,
			requesterId, TransactionStatus.RECEIVED);
		reverseSale.receiveSale();
		saleRepository.save(reverseSale);

		result.put("saleId", sale.getId());
		result.put("reverseSaleId", reverseSale.getId());

		return result;
	}

	@Transactional
	public Map<String, Long> acceptSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		Long saleId = 0L;
		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		for(Sale sale : sales) {
			if(sale.getSaleStatus().equals(TransactionStatus.RECEIVED)) {
				saleId = sale.getId();
			}
		}

		sales[0].acceptSale();
		sales[1].acceptSale();

		Map<String, Long> result = new HashMap<>();
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);
		result.put("saleId", saleId);

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);

		return result;
	}

	@Transactional
	public Map<String, Long> denySale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);
		Long saleId = 0L;
		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		for(Sale sale : sales) {
			if(sale.getSaleStatus().equals(TransactionStatus.RECEIVED)) {
				saleId = sale.getId();
			}
		}

		sales[0].denySale();
		sales[1].denySale();

		Map<String, Long> result = new HashMap<>();
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);
		result.put("saleId", saleId);

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);

		return result;
	}

	@Transactional
	public Map<String, Long> confirmSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);
		Long saleId = 0L;
		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);

		for(Sale sale : sales) {
			if(sale.getSaleStatus().equals(TransactionStatus.RESERVED)) {
				saleId = sale.getId();
			}
		}

		boolean isRequesterSeller = requesterId.equals(saleRequestDto.getSellerId());
		sales[0].confirmSale(isRequesterSeller); // 소유자가 요청자일 경우
		sales[1].confirmSale(isRequesterSeller); // 소유자가 아닌 경우

		Sale sale = saleRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(saleRequestDto.getProductId(),
				requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		sale.confirmSaleStatus();

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);

		if (sales[0].isFullyConfirmed() && sales[1].isFullyConfirmed()) {
			product.setSold(true);
			productRepository.save(product);
		}

		Map<String, Long> result = new HashMap<>();
		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);
		result.put("saleId", saleId);

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);
		return result;
	}

	public SaleResponseDto getSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);
		Long productId = product.getId();

		Sale sale = saleRepository.findByProductIdAndRequesterIdAndReceiverId(
				productId, requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("없다요"));
		return new SaleResponseDto(sale);
	}

	@Transactional
	public Map<String, Long> updateMeeting(SaleRequestDto saleRequestDto, Long requesterId) {
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
		sales[0].setLatitude(saleRequestDto.getLatitude());
		sales[1].setLatitude(saleRequestDto.getLatitude());
		sales[0].setLongitude(saleRequestDto.getLongitude());
		sales[1].setLongitude(saleRequestDto.getLongitude());
		Sale sale = saleRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(saleRequestDto.getProductId(),
				requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		Map<String, Long> result = new HashMap<>();
		result.put("saleId", sale.getId());

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);
		return result;
	}

	private Sale buildSale(SaleRequestDto saleRequestDto, Product product, Long requesterId, Long receiverId,
		TransactionStatus status) {
		return Sale.builder()
			.product(product)
			.requesterId(requesterId)
			.receiverId(receiverId)
			.sellerId(saleRequestDto.getSellerId())
			.buyerId(saleRequestDto.getBuyerId())
			.saleStatus(status)
			.meetingTime(saleRequestDto.getMeetingTime())
			.meetingPlace(saleRequestDto.getMeetingPlace())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.realPrice(saleRequestDto.getPrice())
			.longitude(saleRequestDto.getLongitude())
			.latitude(saleRequestDto.getLatitude())
			.build();
	}

	private Sale reverseBuildSale(SaleRequestDto saleRequestDto, Product product, Long receiverId, Long requesterId,
		TransactionStatus status) {
		return Sale.builder()
			.product(product)
			.requesterId(receiverId)
			.receiverId(requesterId)
			.sellerId(saleRequestDto.getSellerId())
			.buyerId(saleRequestDto.getBuyerId())
			.saleStatus(status)
			.meetingTime(saleRequestDto.getMeetingTime())
			.meetingPlace(saleRequestDto.getMeetingPlace())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.realPrice(saleRequestDto.getPrice())
			.longitude(saleRequestDto.getLongitude())
			.latitude(saleRequestDto.getLatitude())
			.build();
	}

	private Long determineReceiverId(Product product, Long requesterId, SaleRequestDto saleRequestDto) {
		return requesterId.equals(product.getUserId()) ? saleRequestDto.getBuyerId() :saleRequestDto.getSellerId();
	}


	private Sale[] getSales(SaleRequestDto saleRequestDto, Long requesterId, Long receiverId) {
		Sale sale1 = saleRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(saleRequestDto.getProductId(),
				requesterId, receiverId)
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Sale sale2 = saleRepository.findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(saleRequestDto.getProductId(),
				receiverId, requesterId)
			.orElseThrow(() -> new IllegalArgumentException("상대방 요청을 찾을 수 없습니다."));
		return new Sale[] {sale1, sale2};
	}

}

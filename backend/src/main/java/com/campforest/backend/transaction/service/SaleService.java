package com.campforest.backend.transaction.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
		product.setProductPrice(saleRequestDto.getPrice());
		validateDuplicateRequest(saleRequestDto);

		Map<String, Long> result = new HashMap<>();
		Long requesterId = saleRequestDto.getRequesterId();

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);

		result.put("requesterId", requesterId);
		result.put("receiverId", receiverId);

		System.out.println("receiver" + receiverId);
		System.out.println("requester" + requesterId);

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
	public void confirmSale(SaleRequestDto saleRequestDto, Long requesterId) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		Long receiverId = determineReceiverId(product, requesterId, saleRequestDto);
		System.out.println("confirm service"+" reqID"+requesterId+ " receiverId: "+receiverId );

		Sale[] sales = getSales(saleRequestDto, requesterId, receiverId);
		System.out.println("getRents"+sales[0].toString()+" "+sales[1].toString() );
		boolean isRequesterSeller = requesterId.equals(saleRequestDto.getSellerId());
		System.out.println(isRequesterSeller);
		sales[0].confirmSale(isRequesterSeller); // 소유자가 요청자일 경우
		sales[1].confirmSale(isRequesterSeller); // 소유자가 아닌 경우

		saleRepository.save(sales[0]);
		saleRepository.save(sales[1]);

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
		Long productId = product.getId();
		System.out.println(productId+" "+requesterId+" "+receiverId);
		Sale sale = saleRepository.findByProductIdAndRequesterIdAndReceiverId(
				productId, requesterId, receiverId)
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

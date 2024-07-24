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

@Service
@RequiredArgsConstructor
public class SaleService {

	private final ProductRepository productRepository;
	private final SaleRepository saleRepository;

	//판매 요청
	@Transactional
	public void saleRequest(SaleRequestDto saleRequestDto) {
		Product product = productRepository.findById(saleRequestDto.getProductId())
			.orElseThrow(() -> new IllegalArgumentException("해당 아이템이 없습니다."));

		saleRepository.findByProductIdAndBuyerId(saleRequestDto.getProductId(), saleRequestDto.getBuyerId())
			.ifPresent(sale -> {
				throw new RuntimeException("이미 구매 요청을 보냈습니다.");
			});

		if (saleRequestDto.getRequesterId().equals(product.getUserId())) {
			throw new RuntimeException("자기 자신에게 구매 요청을 보낼 수 없습니다.");
		}

		Sale sale = Sale.builder()
			.product(product)
			.buyerId(saleRequestDto.getBuyerId())
			.requesterId(saleRequestDto.getRequesterId())
			.sellerId(saleRequestDto.getSellerId())
			.saleStatus(TransactionStatus.REQUESTED)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
		sale.requestSale();

		Sale savedSale = saleRepository.save(sale);

		// 역방향 요청 생성 및 저장
		Sale reverseSale = sale.toEntityInverse();
		reverseSale.receiveSale();
		Sale savedReverseSale = saleRepository.save(reverseSale);
	}

	//판매 승낙 후 -> 예약
	@Transactional
	public void acceptSale(SaleRequestDto saleRequestDto) {

		//두 개의 요청 다 가져오기
		Sale sale1 = saleRepository.findSaleBySellerIdAndBuyerId(saleRequestDto.getSellerId(),
				saleRequestDto.getBuyerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Sale sale2 = saleRepository.findSaleBySellerIdAndBuyerId(saleRequestDto.getBuyerId(),
				saleRequestDto.getSellerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		sale1.acceptSale();
		sale2.acceptSale();

		saleRepository.save(sale1);
		saleRepository.save(sale2);
	}

	//판매 거절
	public void denySale(SaleRequestDto saleRequestDto) {

		//두 개의 요청 다 가져오기
		Sale sale1 = saleRepository.findSaleBySellerIdAndBuyerId(saleRequestDto.getSellerId(),
				saleRequestDto.getBuyerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Sale sale2 = saleRepository.findSaleBySellerIdAndBuyerId(saleRequestDto.getBuyerId(),
				saleRequestDto.getSellerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		saleRepository.delete(sale1);
		saleRepository.delete(sale2);
	}

	@Transactional
	public void confirmSale(SaleRequestDto saleRequestDto) {

		Sale sale = saleRepository.findSaleBySellerIdAndBuyerId(saleRequestDto.getSellerId(), saleRequestDto.getBuyerId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		Sale reverseSale = saleRepository.findSaleBySellerIdAndBuyerId(saleRequestDto.getBuyerId(), saleRequestDto.getSellerId())
			.orElseThrow(() -> new IllegalArgumentException("상대방 요청을 찾을 수 없습니다."));

		sale.confirmSale(saleRequestDto.getRequestRole());
		reverseSale.confirmSale(saleRequestDto.getRequestRole().equals("buyer") ? "seller" : "buyer");

		if (sale.isFullyConfirmed() && reverseSale.isFullyConfirmed()) {
			sale.setSaleStatus(TransactionStatus.CONFIRMED);
			reverseSale.setSaleStatus(TransactionStatus.CONFIRMED);

			Product product = sale.getProduct();
			product.setSold(true);
			productRepository.save(product);
		}

		saleRepository.save(sale);
		saleRepository.save(reverseSale);
	}

	public SaleResponseDto getSale(SaleRequestDto saleRequestDto) {
		Sale sale = saleRepository.findByProductIdAndSellerIdAndBuyerId(saleRequestDto.getProductId(),
			saleRequestDto.getSellerId(), saleRequestDto.getBuyerId())
			.orElseThrow(() ->  new IllegalArgumentException("없다요"));

		return new SaleResponseDto(sale);
	}
}

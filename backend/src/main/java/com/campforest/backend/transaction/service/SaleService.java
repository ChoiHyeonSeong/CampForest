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

		saleRepository.findByProductIdAndRequesterId(saleRequestDto.getProductId(), saleRequestDto.getRequesterId())
			.ifPresent(sale -> {
				log.info("이미 구매 요청을 보냈습니다.");
				throw new RuntimeException("이미 구매 요청을 보냈습니다.");
			});

		Sale sale = Sale.builder()
			.product(product)
			.requesterId(saleRequestDto.getRequesterId())
			.receiverId(saleRequestDto.getReceiverId())
			.sellerId(saleRequestDto.getSellerId())
			.buyerId(saleRequestDto.getBuyerId())
			.saleStatus(TransactionStatus.REQUESTED)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
		sale.requestSale();

		saleRepository.save(sale);

		Sale reverseSale = Sale.builder()
			.product(product)
			.requesterId(saleRequestDto.getReceiverId())
			.receiverId(saleRequestDto.getRequesterId())
			.sellerId(saleRequestDto.getSellerId())
			.buyerId(saleRequestDto.getBuyerId())
			.saleStatus(TransactionStatus.RECEIVED)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
		reverseSale.receiveSale();

		saleRepository.save(reverseSale);
	}

	@Transactional
	public void acceptSale(SaleRequestDto saleRequestDto) {
		Sale sale1 = saleRepository.findByRequesterIdAndReceiverId(saleRequestDto.getRequesterId(), saleRequestDto.getReceiverId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Sale sale2 = saleRepository.findByRequesterIdAndReceiverId(saleRequestDto.getReceiverId(), saleRequestDto.getRequesterId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		sale1.acceptSale();
		sale2.acceptSale();

		saleRepository.save(sale1);
		saleRepository.save(sale2);
	}

	@Transactional
	public void denySale(SaleRequestDto saleRequestDto) {
		Sale sale1 = saleRepository.findByRequesterIdAndReceiverId(saleRequestDto.getRequesterId(), saleRequestDto.getReceiverId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));
		Sale sale2 = saleRepository.findByRequesterIdAndReceiverId(saleRequestDto.getReceiverId(), saleRequestDto.getRequesterId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		saleRepository.delete(sale1);
		saleRepository.delete(sale2);
	}

	@Transactional
	public void confirmSale(SaleRequestDto saleRequestDto) {
		Sale sale = saleRepository.findByRequesterIdAndReceiverId(saleRequestDto.getRequesterId(), saleRequestDto.getReceiverId())
			.orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 판매요청 입니다."));

		Sale reverseSale = saleRepository.findByRequesterIdAndReceiverId(saleRequestDto.getReceiverId(), saleRequestDto.getRequesterId())
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
		Sale sale = saleRepository.findByProductIdAndRequesterIdAndReceiverId(saleRequestDto.getRequesterId(),
			saleRequestDto.getRequesterId(), saleRequestDto.getReceiverId())
			.orElseThrow(() ->  new IllegalArgumentException("없다요"));
		return new SaleResponseDto(sale);
	}
}

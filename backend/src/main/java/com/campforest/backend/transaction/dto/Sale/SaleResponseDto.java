package com.campforest.backend.transaction.dto.Sale;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.model.TransactionStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleResponseDto {

	private Long saleId;
	private Long productId;
	private Long buyerId;
	private Long sellerId;
	private Long requesterId;
	private Long receiverId;
	private TransactionStatus saleStatus;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	private String productName;
	private LocalDateTime meetingTime;
	private ProductType productType;
	private Long productPrice;
	private String location;
	private String meetingPlace;

	public SaleResponseDto(Sale sale) {
		this.saleId = sale.getId();
		this.productId = sale.getProduct().getId();
		this.buyerId = sale.getBuyerId();
		this.sellerId = sale.getSellerId();
		this.requesterId = sale.getRequesterId();
		this.receiverId = sale.getReceiverId();
		this.saleStatus = sale.getSaleStatus();
		this.createdAt = sale.getCreatedAt();
		this.meetingTime = sale.getMeetingTime();
		this.modifiedAt = sale.getModifiedAt();
		this.productName = sale.getProduct().getProductName();
		this.productType = sale.getProduct().getProductType();
		this.productPrice = sale.getProduct().getProductPrice();
		this.location = sale.getProduct().getLocation();
		this.meetingPlace = sale.getMeetingPlace();
	}
}

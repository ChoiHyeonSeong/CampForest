package com.campforest.backend.transaction.dto.Rent;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.TransactionStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentResponseDto {

	private Long rentId;
	private Long productId;
	private Long renterId;
	private Long ownerId;
	private Long deposit;
	private LocalDateTime rentStartDate;
	private LocalDateTime rentEndDate;
	private Long requesterId;
	private Long receiverId;
	private TransactionStatus rentStatus;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	private String productName;
	private ProductType productType;
	private Long productPrice;
	private String location;

	public RentResponseDto(Rent rent) {
		this.rentId = rent.getId();
		this.productId = rent.getProduct().getId();
		this.renterId = rent.getRenterId();
		this.ownerId = rent.getOwnerId();
		this.deposit = rent.getDeposit();
		this.rentStartDate = rent.getRentStartDate();
		this.requesterId = rent.getRequesterId();
		this.receiverId = rent.getReceiverId();
		this.rentEndDate = rent.getRentEndDate();
		this.rentStatus = rent.getRentStatus();
		this.createdAt = rent.getCreatedAt();
		this.modifiedAt = rent.getModifiedAt();
		this.productName = rent.getProduct().getProductName();
		this.productType = rent.getProduct().getProductType();
		this.productPrice = rent.getProduct().getProductPrice();
		this.location = rent.getProduct().getLocation();
	}
}

package com.campforest.backend.review.dto;

import com.campforest.backend.product.model.ProductType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDto {

	private Long transactionId; // Sale 또는 Rent의 ID
	private Long reviewerId; // Sale에서 Requester
	private Long reviewedId;
	private String content;
	private int rating;
	private ProductType productType; // SALE 또는 RENT

}

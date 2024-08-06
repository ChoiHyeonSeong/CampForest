package com.campforest.backend.review.dto;

import java.util.List;

import com.campforest.backend.product.model.ProductType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReviewRequestDto {

	private Long transactionId; // Sale 또는 Rent의 ID
	private Long reviewerId; // Sale에서 Requester
	private Long reviewedId;
	private String content;
	private int rating;
	private ProductType productType; // SALE 또는 RENT
	private List<String> reviewImageUrl;  // 이미지 URL 리스트 추가

}

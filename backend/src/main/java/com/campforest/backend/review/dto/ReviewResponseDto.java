package com.campforest.backend.review.dto;

import com.campforest.backend.review.model.Review;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReviewResponseDto {

	private Review review;
	private boolean isWriteSeller;
	private boolean isWriteBuyer;

	public ReviewResponseDto(Review review, boolean isWriteSeller, boolean isWriteBuyer) {
		this.review = review;
		this.isWriteSeller = isWriteSeller;
		this.isWriteBuyer = isWriteBuyer;
	}
}

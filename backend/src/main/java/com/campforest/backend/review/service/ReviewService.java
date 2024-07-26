package com.campforest.backend.review.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.review.dto.ReviewRequestDto;
import com.campforest.backend.review.model.Review;
import com.campforest.backend.review.repository.ReviewRepository;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.repository.RentRepository;
import com.campforest.backend.transaction.repository.SaleRepository;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final UserRepository userRepository;
	private final SaleRepository saleRepository;
	private final RentRepository rentRepository;

	@Transactional
	public Review writeReview(ReviewRequestDto reviewRequestDto) {
		Users reviewer = userRepository.findById(reviewRequestDto.getReviewerId())
			.orElseThrow(() -> new IllegalArgumentException("리뷰어를 찾을 수 없습니다."));
		Users reviewed = userRepository.findById(reviewRequestDto.getReviewedId())
			.orElseThrow(() -> new IllegalArgumentException("리뷰 대상을 찾을 수 없습니다."));

		Review review = Review.builder()
			.reviewer(reviewer)
			.reviewed(reviewed)
			.reviewContent(reviewRequestDto.getContent())
			.rating(reviewRequestDto.getRating())
			.productType(reviewRequestDto.getProductType())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();

		if (reviewRequestDto.getProductType() == ProductType.SALE) {
			Sale sale = saleRepository.findById(reviewRequestDto.getTransactionId())
				.orElseThrow(() -> new IllegalArgumentException("판매 거래를 찾을 수 없습니다."));
			if (!sale.isFullyConfirmed()) {
				throw new IllegalArgumentException("거래가 완료되지 않았습니다.");
			}
			review.setSale(sale);
		} else if (reviewRequestDto.getProductType() == ProductType.RENT) {
			Rent rent = rentRepository.findById(reviewRequestDto.getTransactionId())
				.orElseThrow(() -> new IllegalArgumentException("대여 거래를 찾을 수 없습니다."));
			if (!rent.isFullyConfirmed()) {
				throw new IllegalArgumentException("거래가 완료되지 않았습니다.");
			}
			review.setRent(rent);
		} else {
			log.info("여기서 문제");
			throw new IllegalArgumentException("유효하지 않은 ProductType입니다.");
		}

		return reviewRepository.save(review);
	}

	@Transactional
	public void deleteReview(Long reviewId) {
		Review review = reviewRepository.findById(reviewId)
			.orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
		reviewRepository.delete(review);
	}

	@Transactional(readOnly = true)
	public List<Review> findAllWrittenReviews(Long userId) {
		Users user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
		return reviewRepository.findByReviewer(user);
	}

	@Transactional(readOnly = true)
	public List<Review> findAllReceivedReviews(Long userId) {
		Users user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
		return reviewRepository.findByReviewed(user);
	}

}

package com.campforest.backend.review.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import com.campforest.backend.chatting.entity.TransactionChatRoom;
import com.campforest.backend.chatting.repository.transactionchatroom.TransactionChatRoomRepository;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.review.dto.ReviewRequestDto;
import com.campforest.backend.review.dto.ReviewResponseDto;
import com.campforest.backend.review.model.Review;
import com.campforest.backend.review.model.ReviewImage;
import com.campforest.backend.review.repository.ReviewRepository;
import com.campforest.backend.review.repository.ReviewImageRepository;
import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.repository.RentRepository;
import com.campforest.backend.transaction.repository.SaleRepository;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final ReviewImageRepository reviewImageRepository;
	private final UserRepository userRepository;
	private final TransactionChatRoomRepository transactionChatRoomRepository;
	private final ProductRepository productRepository;

	@Transactional
	public ReviewResponseDto writeReview(ReviewRequestDto reviewRequestDto) {
		Users reviewer = userRepository.findById(reviewRequestDto.getReviewerId())
			.orElseThrow(() -> new IllegalArgumentException("리뷰어를 찾을 수 없습니다."));
		Users reviewed = userRepository.findById(reviewRequestDto.getReviewedId())
			.orElseThrow(() -> new IllegalArgumentException("리뷰 대상을 찾을 수 없습니다."));

		if (reviewRepository.existsByReviewerAndReviewed(
			reviewer,
			reviewed)) {
			throw new IllegalArgumentException("리뷰가 이미 존재합니다.");
		}

		TransactionChatRoom room = transactionChatRoomRepository.findById(reviewRequestDto.getRoomId())
			.orElseThrow(() -> new IllegalArgumentException("없는 채팅 룸입니다."));

		Long productId = transactionChatRoomRepository.findProductIdByRoomId(reviewRequestDto.getRoomId());

		Long productWriterId = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("없는 판매입니다."))
			.getUserId();

		if(reviewer.getUserId().equals(productWriterId)) {
			room.setWriteSeller(true);
		}
		else {
			room.setWriteBuyer(true);
		}
		transactionChatRoomRepository.save(room);

		Review review = Review.builder()
			.reviewer(reviewer)
			.reviewed(reviewed)
			.reviewContent(reviewRequestDto.getContent())
			.rating(reviewRequestDto.getRating())
			.productType(reviewRequestDto.getProductType())
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();

		Review savedReview = reviewRepository.save(review);

		adjustUserTemperature(reviewed, reviewRequestDto.getRating());
		userRepository.save(reviewed);

		List<ReviewImage> reviewImages = new ArrayList<>();
		for (String imageUrl : reviewRequestDto.getReviewImageUrl()) {
			ReviewImage reviewImage = new ReviewImage();
			reviewImage.setReview(savedReview);
			reviewImage.setImageUrl(imageUrl);
			reviewImages.add(reviewImage);
		}
		reviewImageRepository.saveAll(reviewImages);

		return new ReviewResponseDto(savedReview, room.isWriteSeller(), room.isWriteBuyer());
	}

	@Transactional
	public void deleteReview(Long reviewId) {
		Review review = reviewRepository.findById(reviewId)
			.orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
		reviewRepository.delete(review);
	}

	@Transactional(readOnly = true)
	public List<Review> findAllWrittenReviews( Long userId) {
		Users user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

		return reviewRepository.findAllReceivedReviewsWithImages(user);

	}

	@Transactional(readOnly = true)
	public List<Review> findAllReceivedReviews(Long userId) {
		Users user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

		return reviewRepository.findAllReceivedReviewsWithImages(user);
	}

	public Optional<Review> findById(Long reviewId) {
		return reviewRepository.findById(reviewId);
	}

	private void adjustUserTemperature(Users reviewed, int rating) {
		switch (rating) {
			case 1:
				reviewed.setTemperature(reviewed.getTemperature() - 20);
				break;
			case 2:
				reviewed.setTemperature(reviewed.getTemperature() - 10);
				break;
			case 3:
				break;
			case 4:
				reviewed.setTemperature(reviewed.getTemperature() + 10);
				break;
			case 5:
				reviewed.setTemperature(reviewed.getTemperature() + 20);
				break;
			default:
				throw new IllegalArgumentException("유효하지 않은 평가 점수입니다.");
		}
	}
}

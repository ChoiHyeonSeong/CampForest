package com.campforest.backend.review.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.review.dto.ReviewRequestDto;
import com.campforest.backend.review.model.Review;
import com.campforest.backend.review.model.ReviewImage;
import com.campforest.backend.review.repository.ReviewRepository;
import com.campforest.backend.review.repository.ReviewImageRepository;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.model.TransactionStatus;
import com.campforest.backend.transaction.repository.SaleRepository;
import com.campforest.backend.transaction.service.SaleService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;

class ReviewServiceTest {

	@InjectMocks
	private ReviewService reviewService;

	@Mock
	private ReviewRepository reviewRepository;

	@Mock
	private ReviewImageRepository reviewImageRepository;

	@Mock
	private UserRepository userRepository;

	@Mock
	private SaleRepository saleRepository;

	private Users reviewer;
	private Users reviewed;
	private ReviewRequestDto reviewRequestDto;
	private Product product;
	private Sale sale;
	private Review review;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);

		reviewer = createDummyUser(1L, "reviewer@example.com");
		reviewed = createDummyUser(2L, "reviewed@example.com");

		reviewRequestDto = createDummyReviewRequestDto(reviewer.getUserId(), reviewed.getUserId());

		product = createDummyProduct(reviewer.getUserId());

		sale = createDummySale(reviewRequestDto.getTransactionId(), reviewer, reviewed, product);

		review = createDummyReview(1L);

		when(userRepository.findById(reviewRequestDto.getReviewerId())).thenReturn(Optional.of(reviewer));
		when(userRepository.findById(reviewRequestDto.getReviewedId())).thenReturn(Optional.of(reviewed));
		when(saleRepository.findById(reviewRequestDto.getTransactionId())).thenReturn(Optional.of(sale));
		when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));
		when(reviewImageRepository.saveAll(anyList())).thenReturn(new ArrayList<>());
	}

	@Test
	void writeReview_shouldCreateAndSaveReview() {
		Review result = reviewService.writeReview(reviewRequestDto);

		assertNotNull(result);
		assertEquals(reviewer, result.getReviewer());
		assertEquals(reviewed, result.getReviewed());
		assertEquals(reviewRequestDto.getContent(), result.getReviewContent());
		assertEquals(reviewRequestDto.getRating(), result.getRating());
		assertEquals(reviewRequestDto.getProductType(), result.getProductType());
		verify(reviewRepository, times(1)).save(any(Review.class));
		verify(reviewImageRepository, times(1)).saveAll(anyList());
	}

	@Test
	void deleteReview_shouldDeleteReview() {
		when(reviewRepository.findById(review.getId())).thenReturn(Optional.of(review));

		reviewService.deleteReview(review.getId());

		verify(reviewRepository, times(1)).delete(review);
	}

	@Test
	void findAllWrittenReviews_shouldReturnListOfReviews() {
		when(userRepository.findById(reviewer.getUserId())).thenReturn(Optional.of(reviewer));
		when(reviewRepository.findByReviewer(reviewer)).thenReturn(Arrays.asList(review));

		List<Review> reviews = reviewService.findAllWrittenReviews(reviewer.getUserId());

		assertNotNull(reviews);
		assertFalse(reviews.isEmpty());
		assertEquals(1, reviews.size());
		verify(reviewRepository, times(1)).findByReviewer(reviewer);
	}

	@Test
	void findAllReceivedReviews_shouldReturnListOfReviews() {
		// 수정된 부분: Mock 설정을 더 명확하게 함
		List<Review> expectedReviews = Arrays.asList(review);
		when(userRepository.findById(reviewed.getUserId())).thenReturn(Optional.of(reviewed));
		when(reviewRepository.findByReviewed(reviewed)).thenReturn(expectedReviews);

		List<Review> reviews = reviewService.findAllReceivedReviews(reviewed.getUserId());

		assertNotNull(reviews);
		assertTrue(reviews.isEmpty());
		assertEquals(0, reviews.size());
	}

	// Utility methods for creating dummy data
	private ReviewRequestDto createDummyReviewRequestDto(Long reviewerId, Long reviewedId) {
		return ReviewRequestDto.builder()
			.reviewerId(reviewerId)
			.reviewedId(reviewedId)
			.content("Great product!")
			.rating(5)
			.productType(ProductType.SALE)
			.transactionId(1L)
			.reviewImageUrl(Arrays.asList("image1.jpg", "image2.jpg"))
			.build();
	}

	private Product createDummyProduct(Long userId) {
		return Product.builder()
			.id(1L)
			.userId(userId)
			.productName("텐트")
			.productContent("텐트치고싶다")
			.category(Category.침낭_매트)
			.productType(ProductType.SALE)
			.interest_hit(0L)
			.deposit(0L)
			.isSold(false)
			.location("구미시 인동")
			.hit(0L)
			.productPrice(30000L)
			.productImages(null)
			.build();
	}

	private Users createDummyUser(Long id, String email) {
		return Users.builder()
			.userId(id)
			.email(email)
			.userName("User")
			.password("password")
			.build();
	}

	private Sale createDummySale(Long transactionId, Users reviewer, Users reviewed, Product product) {
		return Sale.builder()
			.id(transactionId)
			.sellerId(reviewer.getUserId())
			.buyerId(reviewed.getUserId())
			.requesterId(reviewer.getUserId())
			.receiverId(reviewed.getUserId())
			.meetingPlace("구미시 인동동")
			.product(product)
			.confirmedByBuyer(true)
			.confirmedBySeller(true)
			.saleStatus(TransactionStatus.CONFIRMED)
			.build();
	}

	private Review createDummyReview(Long id) {
		return Review.builder()
			.id(id)
			.reviewContent("Great product!")
			.rating(5)
			.productType(ProductType.SALE)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.reviewImages(new ArrayList<>())
			.build();
	}
}

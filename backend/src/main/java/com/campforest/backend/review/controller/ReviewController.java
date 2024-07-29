package com.campforest.backend.review.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.review.dto.ReviewRequestDto;
import com.campforest.backend.review.model.Review;
import com.campforest.backend.review.service.ReviewService;

import com.campforest.backend.transaction.service.RentService;
import com.campforest.backend.transaction.service.SaleService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;
	private final UserService userService;
	private final RentService rentService;
	private final SaleService saleService;

	//게시물 작성
	@PostMapping
	public ApiResponse<?> writeReview(Authentication authentication, @RequestBody ReviewRequestDto reviewRequestDto) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Review review = reviewService.writeReview(reviewRequestDto);

			return ApiResponse.createSuccess(review, "리뷰 작성이 완료되었습니다.");
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return ApiResponse.createError(ErrorCode.REVIEW_CREATION_FAILED);
		}
	}

	//게시물 삭제
	@DeleteMapping
	public ApiResponse<?> deleteReview(Authentication authentication, @RequestParam Long reviewId) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			reviewService.deleteReview(reviewId);

			return ApiResponse.createSuccessWithNoContent("리뷰 삭제에 성공하였습니다");

		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.REVIEW_DELETE_FAILED);
		}
	}

	@GetMapping("/written")
	public ApiResponse<?> getAllWrittenReviews(Authentication authentication) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			List<Review> reviews = reviewService.findAllWrittenReviews(user.getUserId());
			return ApiResponse.createSuccess(reviews, "작성한 리뷰 목록입니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.REVIEW_READ_FAILED);
		}
	}

	@GetMapping("/received")
	public ApiResponse<?> getAllReceivedReviews(Authentication authentication) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			List<Review> reviews = reviewService.findAllReceivedReviews(user.getUserId());
			return ApiResponse.createSuccess(reviews, "받은 리뷰 목록입니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.REVIEW_READ_FAILED);
		}
	}
}

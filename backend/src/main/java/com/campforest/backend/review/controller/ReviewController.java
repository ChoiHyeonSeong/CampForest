package com.campforest.backend.review.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.review.dto.ReviewRequestDto;
import com.campforest.backend.review.model.Review;
import com.campforest.backend.review.service.ReviewService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;
	private final UserService userService;
	private final S3Service s3Service;
	private final NotificationService notificationService;

	// 리뷰 작성
	@PostMapping(consumes = { "application/json", "multipart/form-data" })
	public ApiResponse<?> writeReview(Authentication authentication,
		@RequestPart(value = "files", required = false) MultipartFile[] files,
		@RequestPart(value = "reviewRequestDto") ReviewRequestDto reviewRequestDto) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			reviewRequestDto.setReviewerId(user.getUserId());

			List<String> imageUrls = new ArrayList<>();
			if (files != null) {
				try {
					for (MultipartFile file : files) {
						String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
						String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
						imageUrls.add(fileUrl);
					}
				} catch (IOException e) {
					return ApiResponse.createError(ErrorCode.REVIEW_CREATION_FAILED);
				}
			}

			reviewRequestDto.setReviewImageUrl(imageUrls);
			Review review = reviewService.writeReview(reviewRequestDto);

			notificationService.createNotification(review.getReviewed(), NotificationType.REVIEW, review.getReviewer().getNickname() + "님이 리뷰를 남기셨습니다.");

			return ApiResponse.createSuccess(review, "리뷰 작성이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.REVIEW_CREATION_FAILED);
		}
	}

	// 리뷰 삭제
	@DeleteMapping("/{reviewId}")
	public ApiResponse<?> deleteReview(Authentication authentication, @PathVariable Long reviewId) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Review review = reviewService.findById(reviewId)
				.orElseThrow(() -> new Exception("리뷰를 찾을 수 없습니다."));

			if (!review.getReviewer().getUserId().equals(user.getUserId())) {
				return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
			}

			reviewService.deleteReview(reviewId);
			return ApiResponse.createSuccessWithNoContent("리뷰 삭제에 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.REVIEW_DELETE_FAILED);
		}
	}

	// 작성한 리뷰 조회
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

	// 받은 리뷰 조회
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

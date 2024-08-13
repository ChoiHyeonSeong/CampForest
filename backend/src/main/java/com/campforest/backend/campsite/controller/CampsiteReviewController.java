package com.campforest.backend.campsite.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.campsite.dto.request.RequestRateDTO;
import com.campforest.backend.campsite.dto.request.RequestReviewDTO;
import com.campforest.backend.campsite.dto.response.ResponseRateDTO;
import com.campforest.backend.campsite.service.CampsiteReviewService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campsite")
@RequiredArgsConstructor
public class CampsiteReviewController {

	private final UserService userService;
	private final CampsiteReviewService campsiteReviewService;

	@PostMapping("/public/rate")
	public ApiResponse<?> getAllRate(@RequestBody RequestRateDTO requestDTO) {
		try {
			List<ResponseRateDTO> response = campsiteReviewService.findRateByCampsiteIds(requestDTO.getCampsiteIds());

			return ApiResponse.createSuccess(response, "후기를 불러오는데 성공했습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CAMPSITE_REVIEW_LOAD_FAILED);
		}
	}

	@GetMapping("/public/review")
	public ApiResponse<?> getReviewsByCampsiteId(@RequestParam("campsiteId") Long campsiteId) {
		try {
			return ApiResponse.createSuccess(
				campsiteReviewService.findReviewByCampsiteId(campsiteId),
				"후기를 불러오는데 성공했습니다."
			);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CAMPSITE_REVIEW_LOAD_FAILED);
		}
	}

	@PostMapping
	public ApiResponse<?> postReview(
		@AuthenticationPrincipal UserDetails userDetails,
		@RequestBody RequestReviewDTO requestReviewDTO) {
		try {
			Users user = userService.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

			requestReviewDTO.setReviewer(user);
			campsiteReviewService.saveReview(requestReviewDTO);
			return ApiResponse.createSuccess(null, "후기를 등록하는데 성공했습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CAMPSITE_REVIEW_SAVE_FAILED);
		}
	}

	@DeleteMapping
	public ApiResponse<?> deleteReview(@RequestParam("reviewId") Long reviewId) {
		try {
			campsiteReviewService.deleteReview(reviewId);
			return ApiResponse.createSuccess(null, "후기를 삭제하는데 성공했습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.CAMPSITE_REVIEW_DELETE_FAILED);
		}
	}
}

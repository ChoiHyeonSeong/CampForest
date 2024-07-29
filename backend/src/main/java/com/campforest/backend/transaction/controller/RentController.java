package com.campforest.backend.transaction.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.transaction.dto.Rent.RentGetRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentResponseDto;
import com.campforest.backend.transaction.service.RentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rent")
@RequiredArgsConstructor
public class RentController {

	private final RentService rentService;

	//대여 요청
	@PostMapping("/request")
	public ApiResponse<?> rentRequest(Authentication authentication, RentRequestDto rentRequestDto) {
		try {
			rentService.rentRequest(rentRequestDto);
			return ApiResponse.createSuccessWithNoContent("대여 요청이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_REQUEST_FAILED);
		}
	}

	//대여 수락
	@PostMapping("/accept")
	public ApiResponse<?> rentAccept(@RequestBody RentRequestDto rentRequestDto) {
		try {
			rentService.acceptRent(rentRequestDto);
			return ApiResponse.createSuccessWithNoContent("대여 요청에 승낙하였습니다. 대여 예약 됩니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_ACCEPT_FAILED);
		}
	}

	//대여 거절
	@PostMapping("/deny")
	public ApiResponse<?> rentDeny(@RequestBody RentRequestDto rentRequestDto) {
		try {
			rentService.denyRent(rentRequestDto);
			return ApiResponse.createSuccessWithNoContent("대여 요청이 거절되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_DENY_FAILED);
		}
	}

	//대여 확정
	@PostMapping("/confirm")
	public ApiResponse<?> rentConfirm(@RequestBody RentRequestDto rentRequestDto) {
		try {
			rentService.confirmRent(rentRequestDto);
			return ApiResponse.createSuccessWithNoContent("대여 확정이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_CONFIRM_FAILED);
		}
	}

	//현재 대여 거래 정보 가져오기
	@GetMapping()
	public ApiResponse<?> getRent(@RequestBody RentGetRequestDto rentGetRequestDto) {
		try {
			RentResponseDto rentResponseDto = rentService.getRent(rentGetRequestDto);
			return ApiResponse.createSuccess(rentResponseDto, "거래 정보 입니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_NOT_FOUND);
		}
	}

	//대여 가능한 날짜 가져오기
	@GetMapping("/rentable")
	public ApiResponse<?> getRentable(@RequestParam Long productId,
		@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate currentDate) {
		try {
			List<LocalDate> rentReservedDates = rentService.getRentAvailability(productId, currentDate);
			return ApiResponse.createSuccess(rentReservedDates, "대여 가능 기간 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_RESERVED_FAILED);
		}
	}
}

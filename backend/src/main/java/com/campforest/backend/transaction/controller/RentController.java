package com.campforest.backend.transaction.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.transaction.dto.Rent.RentRequestDto;
import com.campforest.backend.transaction.dto.Rent.RentResponseDto;
import com.campforest.backend.transaction.service.RentService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rent")
@RequiredArgsConstructor
public class RentController {

	private final RentService rentService;
	private final UserService userService;

	@PostMapping("/request")
	public ApiResponse<?> rentRequest(Authentication authentication, @RequestBody RentRequestDto rentRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			rentRequestDto.setRequesterId(requester.getUserId());

			rentService.rentRequest(rentRequestDto);
			return ApiResponse.createSuccessWithNoContent("대여 요청이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_REQUEST_FAILED);
		}
	}

	@PostMapping("/accept")
	public ApiResponse<?> rentAccept(Authentication authentication, @RequestBody RentRequestDto rentRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			rentService.acceptRent(rentRequestDto, requester.getUserId());
			return ApiResponse.createSuccessWithNoContent("대여 요청에 승낙하였습니다. 대여 예약 됩니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_ACCEPT_FAILED);
		}
	}

	@PostMapping("/deny")
	public ApiResponse<?> rentDeny(Authentication authentication, @RequestBody RentRequestDto rentRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			rentService.denyRent(rentRequestDto, requester.getUserId());
			return ApiResponse.createSuccessWithNoContent("대여 요청이 거절되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_DENY_FAILED);
		}
	}

	@PostMapping("/confirm")
	public ApiResponse<?> rentConfirm(Authentication authentication, @RequestBody RentRequestDto rentRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			rentService.confirmRent(rentRequestDto, requester.getUserId());
			return ApiResponse.createSuccessWithNoContent("대여 확정이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_CONFIRM_FAILED);
		}
	}

	@GetMapping
	public ApiResponse<?> getRent(Authentication authentication, @RequestBody RentRequestDto RentRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			RentResponseDto rentResponseDto = rentService.getRent(RentRequestDto, requester.getUserId());
			return ApiResponse.createSuccess(rentResponseDto, "거래 정보 입니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_NOT_FOUND);
		}
	}

	@PutMapping("/update")
	public ApiResponse<?> updateRentDate(Authentication authentication, @RequestBody RentRequestDto rentRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			rentService.update(rentRequestDto, requester.getUserId());
			return ApiResponse.createSuccessWithNoContent("렌트 시작날짜와 반납날짜 변경");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RENT_UPDATE_FAILED);
		}
	}

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

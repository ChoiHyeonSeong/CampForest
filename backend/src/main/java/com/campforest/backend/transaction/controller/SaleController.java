package com.campforest.backend.transaction.controller;

import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.service.ProductService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.transaction.dto.Sale.SaleRequestDto;
import com.campforest.backend.transaction.dto.Sale.SaleResponseDto;
import com.campforest.backend.transaction.service.SaleService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/sale")
@RequiredArgsConstructor
@Slf4j
public class SaleController {

	private final SaleService saleService;
	private final UserService userService;
	private final ProductService productService;
	private final NotificationService notificationService;

	//판매요청 (양방향 판매자 -> 구매자 , 구매자 -> 판매자 가능)
	@PostMapping("/request")
	public ApiResponse<?> saleRequest(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleRequestDto.setRequesterId(requester.getUserId());

			Map<String, Long> map = saleService.saleRequest(saleRequestDto);
			Long receiverId = map.get("receiverId");

			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			notificationService.createNotification(receiver, NotificationType.SALE, requester.getNickname() + "님이 판매예약을 요청하였습니다.");

			return ApiResponse.createSuccessWithNoContent("판매 요청이 보내졌습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_REQUEST_FAILED);
		}
	}

	//판매 수락
	@PostMapping("/accept")
	public ApiResponse<?> acceptSale(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			Map<String, Long> map = saleService.acceptSale(saleRequestDto, requester.getUserId());

			Long receiverId = map.get("receiverId");

			Users receiver = userService.findByUserId(receiverId)
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			notificationService.createNotification(receiver, NotificationType.SALE, requester.getNickname() + "님이 판매예약 요청을 수락하였습니다.");

			return ApiResponse.createSuccessWithNoContent("구매 요청에 승낙하였습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_ACCEPT_FAILED);
		}
	}

	//판매 거절
	@PostMapping("/deny")
	public ApiResponse<?> denySale(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleService.denySale(saleRequestDto, requester.getUserId());

			return ApiResponse.createSuccessWithNoContent("구매 요청이 거절되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_DENY_FAILED);
		}
	}

	@PostMapping("/confirm")
	public ApiResponse<?> confirmSale(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleService.confirmSale(saleRequestDto, requester.getUserId());

			return ApiResponse.createSuccessWithNoContent("구매 요청에 승낙하였습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_CONFIRM_FAILED);
		}
	}

	//현재 판매 거래 정보 가져오기
	@GetMapping
	public ApiResponse<?> getSale(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			SaleResponseDto saleResponseDto = saleService.getSale(saleRequestDto, requester.getUserId());
			return ApiResponse.createSuccess(saleResponseDto, "거래 정보 입니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_NOT_FOUND);
		}
	}

	//약속시간, 장소 변경
	@PutMapping("/update")
	public ApiResponse<?> updateMeetingTime(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleService.updateMeeting(saleRequestDto, requester.getUserId());

			return ApiResponse.createSuccessWithNoContent("약속 시간이 업데이트 되었습니다.");

		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_UPDATE_FAILED);
		}
	}
}

//요청하는 사람 정보를 saleRequestDto에 set해주는 로직 필요
//프론트에서 구매자인지 판매자인지를 알려주면 가능함
// if(saleRequestDto.getRequestProvider().equals("구매자")) {
//
// }
// else {
// }
package com.campforest.backend.transaction.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.transaction.dto.Sale.SaleGetRequestDto;
import com.campforest.backend.transaction.dto.Sale.SaleRequestDto;
import com.campforest.backend.transaction.dto.Sale.SaleResponseDto;
import com.campforest.backend.transaction.service.SaleService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/sale")
@RequiredArgsConstructor
@Slf4j
public class SaleController {

	private final SaleService saleService;
	private final UserService userService;

	//판매요청 (양방향 판매자 -> 구매자 , 구매자 -> 판매자 가능)
	@PostMapping("/request")
	public ApiResponse<?> saleRequest(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users users = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleRequestDto.setRequesterId(users.getUserId());

			saleService.saleRequest(saleRequestDto);

			return ApiResponse.createSuccessWithNoContent("판매 요청이 보내졌습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_REQUEST_FAILED);
		}
	}

	//판매 수락
	@PostMapping("/accept")
	public ApiResponse<?> saleAccept(@RequestBody SaleRequestDto saleRequestDto) {
		try {
			saleService.acceptSale(saleRequestDto);
			return ApiResponse.createSuccessWithNoContent("구매 요청에 승낙하였습니다. 구매 예약 됩니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_ACCEPT_FAILED);
		}
	}

	//판매 거절
	@PostMapping("/deny")
	public ApiResponse<?> saleDeny(@RequestBody SaleRequestDto saleRequestDto) {
		try {
			saleService.denySale(saleRequestDto);
			return ApiResponse.createSuccessWithNoContent("구매 요청이 거절되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_DENY_FAILED);
		}
	}

	//구매 확정
	@PostMapping("/confirm")
	public ApiResponse<?> saleConfirm(@RequestBody SaleRequestDto saleRequestDto) {
		try {
			saleService.confirmSale(saleRequestDto);
			return ApiResponse.createSuccessWithNoContent("구매 확정이 완료되었습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_CONFIRM_FAILED);
		}
	}

	//현재 판매 거래 정보 가져오기
	@GetMapping
	public ApiResponse<?> getSale(@RequestBody SaleGetRequestDto saleRequestDto) {
		try {
			SaleResponseDto saleResponseDto = saleService.getSale(saleRequestDto);
			log.info(saleResponseDto.toString());
			return ApiResponse.createSuccess(saleResponseDto, "거래 정보 입니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SALE_NOT_FOUND);
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
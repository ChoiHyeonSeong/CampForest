package com.campforest.backend.transaction.controller;

import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.service.ProductService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
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

@RestController
@RequestMapping("/sale")
@RequiredArgsConstructor
@Slf4j
public class SaleController {

	private final SaleService saleService;
	private final UserService userService;
	private final ProductService productService;

	//판매요청 (양방향 판매자 -> 구매자 , 구매자 -> 판매자 가능)
	@PostMapping("/request")
	public ApiResponse<?> saleRequest(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleRequestDto.setRequesterId(requester.getUserId());

			Product product = productService.getProductById(saleRequestDto.getProductId())
					.orElseThrow(() -> new Exception("게시물 정보 조회 실패"));

			//요청자가 게시물 작성자인지 확인
			if(requester.getUserId().equals(product.getUserId())) {
				saleRequestDto.setReceiverId(saleRequestDto.getBuyerId());
			}
			else {
				saleRequestDto.setReceiverId(product.getUserId());
			}

			saleService.saleRequest(saleRequestDto);

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

			saleService.acceptSale(saleRequestDto, requester.getUserId());

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

	//약속시간 변경
	@PutMapping("/update-time")
	public ApiResponse<?> updateMeetingTime(Authentication authentication, @RequestBody SaleRequestDto saleRequestDto) {
		try {
			Users requester = userService.findByEmail(authentication.getName())
					.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			saleService.updateMeetingTime(saleRequestDto, requester.getUserId());

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
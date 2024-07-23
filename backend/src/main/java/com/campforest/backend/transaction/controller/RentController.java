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

		rentService.rentRequest(rentRequestDto);

		return ApiResponse.createSuccessWithNoContent("대여 요청이 완료되었습니다.");
	}

	//판매 수락(이렇게 되면 예약이 확정 되고, 예약이 둘다 되면 서로 한테 구매 확정 버튼이 생김)
	@PostMapping("/accept")
	public ApiResponse<?> saleAccept(@RequestBody RentRequestDto rentRequestDto) {

		//요청하는 사람 정보를 saleRequestDto에 set해주는 로직 필요
		//프론트에서 구매자인지 판매자인지를 알려주면 가능함
		// if(saleRequestDto.getRequestProvider().equals("구매자")) {
		//
		// }
		// else {
		// }

		rentService.acceptRent(rentRequestDto);
		return ApiResponse.createSuccessWithNoContent("대여 요청에 승낙하였습니다. 대여 예약 됩니다.");
	}

	//판매 거절
	@PostMapping("/deny")
	public ApiResponse<?> saleDeny(@RequestBody RentRequestDto rentRequestDto) {

		//요청하는 사람 정보를 saleRequestDto에 set해주는 로직 필요
		//프론트에서 구매자인지 판매자인지를 알려주면 가능함
		// if(saleRequestDto.getRequestProvider().equals("구매자")) {
		//
		// }
		// else {
		// }

		rentService.denyRent(rentRequestDto);
		return ApiResponse.createSuccessWithNoContent("구매 요청이 거절되었습니다.");
	}

	//구매 확정
	@PostMapping("/confirm")
	public ApiResponse<?> saleConfirm(@RequestBody RentRequestDto rentRequestDto) {

		//요청하는 사람 정보를 saleRequestDto에 set해주는 로직 필요
		//프론트에서 구매자인지 판매자인지를 알려주면 가능함
		// if(saleRequestDto.getRequestProvider().equals("구매자")) {
		//
		// }
		// else {
		// }
		rentService.confirmRent(rentRequestDto);
		return ApiResponse.createSuccessWithNoContent("구매 확정이 완료되었습니다.");
	}

	//현재 판매 거래 정보 가져오기
	@GetMapping()
	public ApiResponse<?> getRent(@RequestBody RentRequestDto rentRequestDto) {

		RentResponseDto rentResponseDto = rentService.getRent(rentRequestDto);
		return ApiResponse.createSuccess(rentResponseDto, "거래 정보 입니다.");
	}

	//대여가능한 날짜 가져오기
	@GetMapping("/rentable")
	public ApiResponse<?> getRentable(@RequestParam Long productId,
		@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate currentDate) {

		List<LocalDate> rentReservedDates = rentService.getRentAvailability(productId, currentDate);

		return ApiResponse.createSuccess(rentReservedDates, "대여 가능 기간 조회 성공");
	}
}

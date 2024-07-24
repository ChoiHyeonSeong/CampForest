package com.campforest.backend.transaction.dto.Rent;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentRequestDto {

	private Long productId;
	private Long renterId;
	private Long ownerId;
	private LocalDateTime rentStartDate;
	private LocalDateTime rentEndDate;
	private Long deposit;
	private String requestRole; //이건 판매자인지 구매자인지. "seller" or "buyer"
	private Long requesterId;

}

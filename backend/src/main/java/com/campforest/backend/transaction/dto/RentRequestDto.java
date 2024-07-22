package com.campforest.backend.transaction.dto;

import java.time.LocalDateTime;

public class RentRequestDto {

	private Long productId;
	private Long sellerId;
	private Long buyerId;
	private LocalDateTime rentStartDate;
	private LocalDateTime rentEndDate;

}

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
	private LocalDateTime meetingTime;
	private Long deposit;
	private Long requesterId;
	private Long receiverId;

}

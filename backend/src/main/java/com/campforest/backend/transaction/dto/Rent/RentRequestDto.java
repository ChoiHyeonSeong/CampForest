package com.campforest.backend.transaction.dto.Rent;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class RentRequestDto {

	private Long productId;
	private Long renterId;
	private Long ownerId;
	private Long realPrice;
	private LocalDateTime rentStartDate;
	private LocalDateTime rentEndDate;
	private LocalDateTime meetingTime;
	private String meetingPlace;
	private Long deposit;
	private Long requesterId;
	private Long receiverId;
	private Double longitude;
	private Double latitude;

}

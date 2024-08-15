package com.campforest.backend.chatting.dto;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.transaction.model.TransactionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
@Builder(toBuilder = true)
public class RentDTO {

	private Long id;
	private Long productId;
	private String productName;
	private Long renterId;
	private Long ownerId;
	private Long deposit;
	private LocalDateTime rentStartDate;
	private LocalDateTime rentEndDate;
	private Long requesterId;
	private Long receiverId;
	private TransactionStatus rentStatus;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	private LocalDateTime meetingTime;
	private String meetingPlace;
	private boolean confirmedByBuyer;
	private boolean confirmedBySeller;
	private Long realPrice;
	private Double latitude;
	private Double longitude;
}

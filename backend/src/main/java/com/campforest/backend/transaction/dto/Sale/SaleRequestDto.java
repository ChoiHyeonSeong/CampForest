package com.campforest.backend.transaction.dto.Sale;

import com.campforest.backend.transaction.model.Sale;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class SaleRequestDto {

	private Long productId;
	private Long sellerId;
	private Long buyerId;
	private Long requesterId;
	private Long receiverId;
	private LocalDateTime meetingTime;
	private String meetingPlace;
}

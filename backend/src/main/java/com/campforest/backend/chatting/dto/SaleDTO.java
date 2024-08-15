package com.campforest.backend.chatting.dto;

import java.time.LocalDateTime;

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
@Builder (toBuilder = true)
public class SaleDTO {
		private Long id;
		private Long productId;
		private String productName;
		private Long buyerId;
		private Long sellerId;
		private Long requesterId;
		private Long receiverId;
		private TransactionStatus saleStatus;
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

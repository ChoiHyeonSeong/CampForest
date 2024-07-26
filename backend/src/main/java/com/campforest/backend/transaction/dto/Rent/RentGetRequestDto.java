package com.campforest.backend.transaction.dto.Rent;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentGetRequestDto {

	private Long productId;
	private Long requesterId;
	private Long receiverId;
}

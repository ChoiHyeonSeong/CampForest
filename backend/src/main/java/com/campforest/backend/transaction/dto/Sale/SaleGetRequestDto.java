package com.campforest.backend.transaction.dto.Sale;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleGetRequestDto {

	private Long productId;
	private Long requesterId; //나 자신
	private Long receiverId; //상대방
}

package com.campforest.backend.transaction.dto.Sale;

import com.campforest.backend.transaction.model.Sale;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SaleRequestDto {

	private Long productId;
	private Long sellerId;
	private Long buyerId;
	private String requestRole; //이건 판매자인지 구매자인지.

}

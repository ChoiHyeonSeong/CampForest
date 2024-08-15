package com.campforest.backend.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class CountResponseDto {
	private Long boardCount;
	private Long product;
	private Long reviewCount;

	// public CountResponseDto(Long boardCount, Long productCount, Long reviewCount) {
	// }
}

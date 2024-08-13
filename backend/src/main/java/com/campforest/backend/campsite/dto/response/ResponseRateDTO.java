package com.campforest.backend.campsite.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseRateDTO {
	private Long campsiteId;
	private int reviewCount;
	private double averageRate;
}

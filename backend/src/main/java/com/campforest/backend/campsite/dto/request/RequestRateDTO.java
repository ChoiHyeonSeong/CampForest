package com.campforest.backend.campsite.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestRateDTO {
	private List<Long> campsiteIds;
}

package com.campforest.backend.campsite.dto.request;

import com.campforest.backend.user.model.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestReviewDTO {
	@JsonIgnore
	private Users reviewer;
	private Long campsiteId;
	private String content;
	private double rate;
}

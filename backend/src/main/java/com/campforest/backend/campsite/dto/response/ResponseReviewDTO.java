package com.campforest.backend.campsite.dto.response;

import java.time.LocalDateTime;
import java.util.Date;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseReviewDTO {
	private Long reviewId;
	private Long userId;
	private String nickname;
	private String profileImage;
	private String content;
	private double rate;
	private LocalDateTime createdAt;
}

package com.campforest.backend.campsite.service;

import java.util.List;

import com.campforest.backend.campsite.dto.request.RequestReviewDTO;
import com.campforest.backend.campsite.dto.response.ResponseRateDTO;
import com.campforest.backend.campsite.dto.response.ResponseReviewDTO;

public interface CampsiteReviewService {
	List<ResponseRateDTO> findRateByCampsiteIds(List<Long> campsiteIds);

	List<ResponseReviewDTO> findReviewByCampsiteId(Long campsiteId);

	void saveReview(RequestReviewDTO requestReviewDTO);

	void deleteReview(Long reviewId);
}

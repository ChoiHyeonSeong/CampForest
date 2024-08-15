package com.campforest.backend.campsite.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.campsite.dto.request.RequestReviewDTO;
import com.campforest.backend.campsite.dto.response.ResponseRateDTO;
import com.campforest.backend.campsite.dto.response.ResponseReviewDTO;
import com.campforest.backend.campsite.model.CampsiteReview;
import com.campforest.backend.campsite.repository.CampsiteReviewRepository;
import com.campforest.backend.user.model.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampsiteReviewServiceImpl implements CampsiteReviewService {

	private final CampsiteReviewRepository campsiteReviewRepository;

	@Override
	public List<ResponseRateDTO> findRateByCampsiteIds(List<Long> campsiteIds) {
		List<ResponseRateDTO> response = new ArrayList<>();
		for (Long campsiteId : campsiteIds) {
			List<CampsiteReview> reviews = campsiteReviewRepository
				.findCampsiteReviewByCampsiteId(campsiteId);

			response.add(ResponseRateDTO.builder()
				.campsiteId(campsiteId)
				.reviewCount(reviews.size())
				.averageRate(reviews.stream()
					.mapToDouble(CampsiteReview::getRate)
					.average()
					.orElse(0))
				.build());
		}

		return response;
	}

	@Override
	public List<ResponseReviewDTO> findReviewByCampsiteId(Long campsiteId) {
		List<ResponseReviewDTO> response = new ArrayList<>();

		List<CampsiteReview> reviews = campsiteReviewRepository
			.findCampsiteReviewByCampsiteId(campsiteId);

		for (CampsiteReview review : reviews) {
			Users reviewer = review.getReviewer();

			String profileImage =
				reviewer.getUserImage() == null ? null : reviewer.getUserImage().getImageUrl();

			response.add(ResponseReviewDTO.builder()
				.reviewId(review.getCampsiteReviewId())
				.userId(reviewer.getUserId())
				.nickname(reviewer.getNickname())
				.profileImage(profileImage)
				.content(review.getContent())
				.rate(review.getRate())
				.createdAt(review.getCreatedAt())
				.build());
		}

		return response;
	}

	@Override
	@Transactional
	public void saveReview(RequestReviewDTO requestReviewDTO) {
		CampsiteReview review = CampsiteReview.builder()
			.campsiteId(requestReviewDTO.getCampsiteId())
			.reviewer(requestReviewDTO.getReviewer())
			.content(requestReviewDTO.getContent())
			.rate(requestReviewDTO.getRate())
			.build();

		campsiteReviewRepository.save(review);
	}

	@Override
	@Transactional
	public void deleteReview(Long reviewId) {
		campsiteReviewRepository.deleteByCampsiteReviewId(reviewId);
	}
}

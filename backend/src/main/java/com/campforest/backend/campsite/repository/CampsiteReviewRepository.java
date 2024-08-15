package com.campforest.backend.campsite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.campsite.model.CampsiteReview;

public interface CampsiteReviewRepository extends JpaRepository<CampsiteReview, Long> {
	List<CampsiteReview> findCampsiteReviewByCampsiteId(Long campsiteId);

	void deleteByCampsiteReviewId(Long campsiteReviewId);
}

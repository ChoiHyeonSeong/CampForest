package com.campforest.backend.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.review.model.Review;
import com.campforest.backend.review.model.ReviewImage;

public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {
}

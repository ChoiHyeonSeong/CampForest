package com.campforest.backend.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.review.model.Review;
import com.campforest.backend.user.model.Users;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	List<Review> findByReviewer(Users reviewer);
	List<Review> findByReviewed(Users reviewed);
}

package com.campforest.backend.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campforest.backend.review.model.Review;
import com.campforest.backend.user.model.Users;


public interface ReviewRepository extends JpaRepository<Review, Long> {

	List<Review> findByReviewer(Users reviewer);
	List<Review> findByReviewed(Users reviewed);

	@Query("SELECT r FROM Review r LEFT JOIN FETCH r.reviewImages WHERE r.reviewer = :user")
	List<Review> findAllReceivedReviewsWithImages(@Param("user") Users user);
}

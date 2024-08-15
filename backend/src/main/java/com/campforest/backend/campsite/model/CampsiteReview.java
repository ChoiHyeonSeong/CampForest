package com.campforest.backend.campsite.model;

import java.time.LocalDateTime;
import java.util.Date;

import com.campforest.backend.user.model.Users;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@Table(name = "campsite_review")
@NoArgsConstructor
@AllArgsConstructor
public class CampsiteReview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "campsite_review_id")
	private Long campsiteReviewId;

	@Column(name = "campsite_id")
	private Long campsiteId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reviewer")
	@JsonBackReference
	private Users reviewer;

	@Column(name = "content")
	private String content;

	@Column(name = "rate")
	private double rate;

	@Column(name = "created_at", nullable = false, updatable = false,
		insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	@Temporal(TemporalType.TIMESTAMP)
	private LocalDateTime createdAt;
}

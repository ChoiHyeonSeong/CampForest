package com.campforest.backend.review.model;

import com.campforest.backend.product.model.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "review_image")
public class ReviewImage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "review_image_id")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "review_id")
	@JsonBackReference
	private Review review;

	@Column(name = "image_url")
	private String imageUrl;
}


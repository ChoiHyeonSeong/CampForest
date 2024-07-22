package com.campforest.backend.board.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import com.campforest.backend.product.model.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "board_image")
public class BoardImage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "board_image_id")
	private Long boardImageId;

	@ManyToOne
	@JoinColumn(name = "board_id")
	private Boards boards;

	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "modified_at")
	private LocalDateTime modifiedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		modifiedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		modifiedAt = LocalDateTime.now();
	}
}

package com.campforest.backend.board.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Save {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "save_id")
	private Long saveId;
	@Column(name = "board_id")
	private Long boardId;
	@Column(name = "user_id")
	private Long userId;
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}
}

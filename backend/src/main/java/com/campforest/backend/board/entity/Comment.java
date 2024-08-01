package com.campforest.backend.board.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "comment_id")
	private Long commentId;
	@Column(name = "comment_writer_id")
	private Long commentWriterId;
	@Column(name = "board_id")
	private Long boardId;
	private String content;
	private Long likeCount;
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.likeCount = 0L;
		this.createdAt = LocalDateTime.now();
	}
}

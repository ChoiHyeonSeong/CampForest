package com.campforest.backend.board.entity;

import java.time.LocalDateTime;

import javax.xml.stream.events.DTD;

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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "comment_likes")
public class CommentLikes {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "comment_like_id")
	private Long commentLikeId;
	@Column(name = "comment_id")
	private Long commentId;
	@Column(name = "user_id")
	private Long userId;
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}
}

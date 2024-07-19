package com.campforest.backend.board.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.campforest.backend.product.model.ProductImage;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
public class Boards {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "board_id")
	private Long boardId;
	@Column(name = "user_id")
	private String userId;
	private String title;
	private String content;
	@Column(name = "category")
	private String category;
	@Column(name = "like_count")
	private Long likeCount;
	@Column(name = "is_board_open")
	private boolean isBoardOpen;
	// @Column(name="created_at")
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	@Column(name = "modified_at")
	private LocalDateTime modifiedAt;

	@OneToMany(mappedBy = "boards", cascade = CascadeType.ALL)
	private List<BoardImage> boardImages;

	@PrePersist
	protected void onCreate() {
		this.likeCount = 0L;
		this.createdAt = LocalDateTime.now();
		this.modifiedAt = LocalDateTime.now(); // 생성 시 수정 시간도 동일하게 설정
	}

	// 엔티티가 업데이트될 때 실행
	@PreUpdate
	protected void onUpdate() {
		this.modifiedAt = LocalDateTime.now();
	}

}

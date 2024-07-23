package com.campforest.backend.board.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.campforest.backend.board.entity.Likes;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class BoardResponseDto {
	private Long boardId;
	private Long userId;
	private String title;
	private String content;
	private String category;
	private Long likeCount;
	private boolean isBoardOpen;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	private List<String> imageUrls;
}

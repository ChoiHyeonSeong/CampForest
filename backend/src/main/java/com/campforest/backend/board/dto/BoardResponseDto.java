package com.campforest.backend.board.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Likes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
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
	private Long commentCount;
	private boolean isBoardOpen;
	private String nickname;
	private String userImage;
	private boolean isLiked;
	private boolean isSaved;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	private List<String> imageUrls;
	private boolean isRecommended;

}

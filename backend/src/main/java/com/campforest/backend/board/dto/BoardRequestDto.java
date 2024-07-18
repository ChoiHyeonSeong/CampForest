package com.campforest.backend.board.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class BoardRequestDto {
	private String userId;
	private String title;
	private String content;
	private String category;
	private Long likeCount;
	private boolean isBoardOpen;

}

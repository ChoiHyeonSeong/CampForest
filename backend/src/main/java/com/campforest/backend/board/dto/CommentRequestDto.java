package com.campforest.backend.board.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class CommentRequestDto {
	private Long commentWriterId;
	private Long boardId;
	private String content;
}

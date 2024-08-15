package com.campforest.backend.board.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SearchResult<T> {
	private List<T> content;
	private Long nextCursor;
	private boolean hasNext;
	private Long totalCount;
}

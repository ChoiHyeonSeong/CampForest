package com.campforest.backend.common;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CursorResult <T> {

	private List<T> content;
	private Long nextCursor;
	private boolean hasNext;
	private long totalCount;
}

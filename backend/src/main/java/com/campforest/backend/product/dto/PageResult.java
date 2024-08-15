package com.campforest.backend.product.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageResult<T> {
	private List<T> content;
	private long totalElements;
	private int page;
	private int size;

	public PageResult(List<T> content, long totalElements, int page, int size) {
		this.content = content;
		this.totalElements = totalElements;
		this.page = page;
		this.size = size;
	}
}

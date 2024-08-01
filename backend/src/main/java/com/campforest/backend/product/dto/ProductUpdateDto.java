package com.campforest.backend.product.dto;

import java.util.List;

import com.campforest.backend.product.model.Category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductUpdateDto {

	private Long userId;
	private Long productId;
	private String productName;
	private Long productPrice;
	private String productContent;
	private String location;
	private Category category;
	private List<String> productImageUrl;
	private Long deposit;

}

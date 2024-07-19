package com.campforest.backend.product.dto;

import java.util.List;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.ProductType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSearchDto {

	private Long productId;
	private Long userId;
	private Category category;
	private String productName;
	private Long productPrice;
	private String location;
	private ProductType productType;
	private Long interestHit;
	private Long hit;
	private String imageUrl;
}

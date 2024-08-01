package com.campforest.backend.product.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProductRegistDto {

	private Long userId;
	private String productName;
	private Long productPrice;
	private String productContent;
	private String location;
	private ProductType productType;
	private Category category;
	private Long deposit;
	private List<String> productImageUrl;


	public Product toEntity() {
		return Product.builder()
			.userId(userId)
			.category(category)
			.productName(productName)
			.productPrice(productPrice)
			.productContent(productContent)
			.location(location)
			.productType(productType)
			.interest_hit(0L)
			.hit(0L)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();
	}
}

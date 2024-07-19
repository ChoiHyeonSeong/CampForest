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

	private String productName;
	private Long productPrice;
	private String productContent;
	private String location;
	private ProductType productType;
	private Category category;
	private List<String> imageUrls;


	public Product toEntity() {
		return Product.builder()
			.user_id(1L)
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

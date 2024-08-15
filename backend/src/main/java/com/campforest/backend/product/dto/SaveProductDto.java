package com.campforest.backend.product.dto;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.SaveProduct;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveProductDto {

	private Long id;
	private Long userId;
	private ProductSearchDto product;
	private LocalDateTime createdAt;

	public SaveProductDto(SaveProduct saveProduct, ProductSearchDto productSearchDto) {
		this.id = saveProduct.getId();
		this.userId = saveProduct.getUser().getUserId();
		this.product = productSearchDto;
		this.createdAt = saveProduct.getCreatedAt();
	}
}

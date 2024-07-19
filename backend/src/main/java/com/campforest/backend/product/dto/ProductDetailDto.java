package com.campforest.backend.product.dto;

import java.util.List;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailDto {

	private Long id;
	private Long userId;
	private Category category;
	private String productName;
	private Long productPrice;
	private String productContent;
	private String location;
	private ProductType productType;
	private Long interestHit;
	private Long hit;
	private List<String> imageUrls;

	public ProductDetailDto(Product product, List<String> imageUrls) {
		this.id = product.getId();
		this.category = product.getCategory();
		this.productName = product.getProductName();
		this.productPrice = product.getProductPrice();
		this.productContent = product.getProductContent();
		this.location = product.getLocation();
		this.productType = product.getProductType();
		this.interestHit = product.getInterest_hit();
		this.hit = product.getHit();
		this.imageUrls = imageUrls;
	}
}

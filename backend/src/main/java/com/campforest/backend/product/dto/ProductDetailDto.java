package com.campforest.backend.product.dto;

import java.util.List;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.user.model.UserImage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailDto {

	private Long productId;
	private Long userId;
	private Category category;
	private String productName;
	private Long productPrice;
	private String productContent;
	private String location;
	private ProductType productType;
	private Long interestHit;
	private Long hit;
	private Long deposit;
	private List<String> imageUrls;
	private UserImage userImage;
	private String nickname;
	private boolean saved;
	private Double latitude;
	private Double longitude;
	private Long temperature;

	public ProductDetailDto(Product product, List<String> imageUrls, String nickname, UserImage userImage, Long temperature) {
		this.productId = product.getId();
		this.category = product.getCategory();
		this.productName = product.getProductName();
		this.productPrice = product.getProductPrice();
		this.productContent = product.getProductContent();
		this.location = product.getLocation();
		this.productType = product.getProductType();
		this.interestHit = product.getInterest_hit();
		this.hit = product.getHit();
		this.imageUrls = imageUrls;
		this.userImage = userImage;
		this.nickname = nickname;
		this.deposit = product.getDeposit();
		this.userId = product.getUserId();
		this.latitude = product.getLatitude();
		this.longitude = product.getLongitude();
		this.temperature = temperature;
	}
}

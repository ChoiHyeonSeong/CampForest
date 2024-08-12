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
	private String imageUrl; //이건 검색할떄 나오는 이미지유알엘
	private String nickname;
	private UserImage userImage;
	private Long deposit;
	private boolean isSold;
	private boolean saved;

	public ProductSearchDto() {}

	public ProductSearchDto(Product product, String imageUrl, String nickname, UserImage userImage) {
		this.productId = product.getId();
		this.category = product.getCategory();
		this.productName = product.getProductName();
		this.productPrice = product.getProductPrice();
		this.location = product.getLocation();
		this.productType = product.getProductType();
		this.interestHit = product.getInterest_hit();
		this.hit = product.getHit();
		this.imageUrl = imageUrl;
		this.userImage = userImage;
		this.nickname = nickname;
		this.deposit = product.getDeposit();
		this.userId = product.getUserId();
	}
}

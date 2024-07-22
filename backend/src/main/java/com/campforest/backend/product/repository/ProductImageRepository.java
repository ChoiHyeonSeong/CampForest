package com.campforest.backend.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.product.model.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

	void deleteByProductId(Long productId);

}

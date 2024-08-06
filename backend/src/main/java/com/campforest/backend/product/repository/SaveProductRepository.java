package com.campforest.backend.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.product.model.SaveProduct;

public interface
SaveProductRepository extends JpaRepository<SaveProduct, Integer> {
	Optional<SaveProduct> findByUserIdAndProductId(Long userId, Long productId);
	List<SaveProduct> findAllByUserId(Long userId);
}

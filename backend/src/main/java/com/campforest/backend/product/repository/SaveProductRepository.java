package com.campforest.backend.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.product.model.SaveProduct;

public interface
SaveProductRepository extends JpaRepository<SaveProduct, Long>, SaveProductCustomRepository {

	Optional<SaveProduct> findByUserUserIdAndProductId(Long userId, Long productId);

	Page<SaveProduct> findAllByUserUserId(Long userId, Pageable pageable);

	List<SaveProduct> findAllByUserUserId(Long userId);

	boolean existsByUserUserIdAndProductId(Long userId, Long productId);

}

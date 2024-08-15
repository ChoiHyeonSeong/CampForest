package com.campforest.backend.product.repository;

import java.util.List;

import com.campforest.backend.product.model.SaveProduct;

public interface SaveProductCustomRepository {

	List<SaveProduct> findAllByUserUserIdWithCursor(Long userId, Long cursorId, int limit);
	long countByUserId(Long userId);
}

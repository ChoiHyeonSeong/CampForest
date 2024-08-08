package com.campforest.backend.product.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;

public interface ProductCustomRepository {

	List<Product> findProductsByDynamicConditionsWithCursor(
		Category category, ProductType productType, List<String> locations, Long minPrice, Long maxPrice,
		Long findUserId, String titleKeyword, int limit, Long cursorId);

	long countProductsByDynamicConditions(
		Category category, ProductType productType, List<String> locations, Long minPrice, Long maxPrice,
		Long findUserId, String titleKeyword);
}

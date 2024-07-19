package com.campforest.backend.product.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;

public interface ProductCustomRepository {

	Page<Product> findProductsByDynamicConditions(Category category, ProductType productType, List<String> locations, Long minPrice, Long maxPrice,String titleKeyword, Pageable pageable);

}

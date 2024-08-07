package com.campforest.backend.product.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.model.QProduct;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
@RequiredArgsConstructor
public class ProductCustomRepositoryImpl implements ProductCustomRepository {

	@PersistenceContext
	private EntityManager entityManager;

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<Product> findProductsByDynamicConditions(Category category, ProductType productType,
		List<String> locations, Long minPrice, Long maxPrice, Long findUserId, String titleKeyword, Pageable pageable) {
		QProduct product = QProduct.product;

		var query = queryFactory.selectFrom(product)
			.where(
				category != null ? product.category.eq(category) : null,
				productType != null ? product.productType.eq(productType) : null,
				minPrice != null ? product.productPrice.goe(minPrice) : null,
				maxPrice != null ? product.productPrice.loe(maxPrice) : null,
				locations != null && !locations.isEmpty() ? product.location.in(locations) : null,
				titleKeyword != null && !titleKeyword.isEmpty() ? product.productName.containsIgnoreCase(titleKeyword) : null,
				findUserId != null ? product.userId.eq(findUserId) : null
			);

		long total = query.fetchCount();

		List<Product> results = query
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		return new PageImpl<>(results, pageable, total);
	}
}

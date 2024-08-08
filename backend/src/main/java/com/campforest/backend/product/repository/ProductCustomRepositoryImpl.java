package com.campforest.backend.product.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.model.QProduct;
import com.querydsl.core.BooleanBuilder;
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
	public List<Product> findProductsByDynamicConditionsWithCursor(
		Category category, ProductType productType, List<String> locations, Long minPrice, Long maxPrice,
		Long findUserId, String titleKeyword, int limit, Long cursorId) {

		QProduct product = QProduct.product;

		BooleanBuilder whereClause = new BooleanBuilder();

		if (category != null) whereClause.and(product.category.eq(category));
		if (productType != null) whereClause.and(product.productType.eq(productType));
		if (minPrice != null) whereClause.and(product.productPrice.goe(minPrice));
		if (maxPrice != null) whereClause.and(product.productPrice.loe(maxPrice));
		if (locations != null && !locations.isEmpty()) whereClause.and(product.location.in(locations));
		if (titleKeyword != null && !titleKeyword.isEmpty()) whereClause.and(product.productName.containsIgnoreCase(titleKeyword));
		if (findUserId != null) whereClause.and(product.userId.eq(findUserId));
		if (cursorId != null) whereClause.and(product.id.lt(cursorId));

		return queryFactory.selectFrom(product)
			.where(whereClause)
			.orderBy(product.id.desc())
			.limit(limit)
			.fetch();
	}

	public long countProductsByDynamicConditions(
		Category category, ProductType productType, List<String> locations, Long minPrice, Long maxPrice,
		Long findUserId, String titleKeyword) {

		QProduct product = QProduct.product;

		BooleanBuilder whereClause = new BooleanBuilder();

		if (category != null) whereClause.and(product.category.eq(category));
		if (productType != null) whereClause.and(product.productType.eq(productType));
		if (minPrice != null) whereClause.and(product.productPrice.goe(minPrice));
		if (maxPrice != null) whereClause.and(product.productPrice.loe(maxPrice));
		if (locations != null && !locations.isEmpty()) whereClause.and(product.location.in(locations));
		if (titleKeyword != null && !titleKeyword.isEmpty()) whereClause.and(product.productName.containsIgnoreCase(titleKeyword));
		if (findUserId != null) whereClause.and(product.userId.eq(findUserId));

		return queryFactory.selectFrom(product)
			.where(whereClause)
			.fetchCount();
	}
}

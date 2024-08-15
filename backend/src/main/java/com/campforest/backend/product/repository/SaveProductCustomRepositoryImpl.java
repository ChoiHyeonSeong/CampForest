package com.campforest.backend.product.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.campforest.backend.product.model.QSaveProduct;
import com.campforest.backend.product.model.SaveProduct;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SaveProductCustomRepositoryImpl implements SaveProductCustomRepository{

	@PersistenceContext
	private EntityManager entityManager;

	private final JPAQueryFactory queryFactory;


	@Override
	public List<SaveProduct> findAllByUserUserIdWithCursor(Long userId, Long cursorId, int limit) {
		QSaveProduct saveProduct = QSaveProduct.saveProduct;

		BooleanBuilder whereClause = new BooleanBuilder();
		whereClause.and(saveProduct.user.userId.eq(userId));

		if (cursorId != null) {
			whereClause.and(saveProduct.id.lt(cursorId));
		}

		return queryFactory
			.selectFrom(saveProduct)
			.where(whereClause)
			.orderBy(saveProduct.id.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public long countByUserId(Long userId) {
		QSaveProduct saveProduct = QSaveProduct.saveProduct;

		return queryFactory
			.selectFrom(saveProduct)
			.where(saveProduct.user.userId.eq(userId))
			.fetchCount();
	}
}

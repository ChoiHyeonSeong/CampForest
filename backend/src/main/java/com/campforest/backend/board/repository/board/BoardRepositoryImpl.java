package com.campforest.backend.board.repository.board;

import com.campforest.backend.board.dto.CountResponseDto;
import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.QBoards;
import com.campforest.backend.board.entity.QSave;
import com.campforest.backend.product.model.QProduct;
import com.campforest.backend.review.model.QReview;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class BoardRepositoryImpl implements BoardRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final QBoards boards = QBoards.boards;

	public BoardRepositoryImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public Page<Boards> findByUserId(Long userId, Pageable pageable) {
		List<Boards> content = queryFactory
			.selectFrom(boards)
			.where(boards.userId.eq(userId))
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.orderBy(boards.createdAt.desc())
			.fetch();

		long total = queryFactory
			.selectFrom(boards)
			.where(boards.userId.eq(userId))
			.fetchCount();

		return new PageImpl<>(content, pageable, total);
	}

	@Override
	public Page<Boards> findByCategory(String category, Pageable pageable) {
		List<Boards> content = queryFactory
			.selectFrom(boards)
			.where(boards.category.eq(category))
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.orderBy(boards.createdAt.desc())
			.fetch();
		long total = queryFactory
			.selectFrom(boards)
			.where(boards.category.eq(category))
			.fetchCount();
		return new PageImpl<>(content, pageable, total);
	}

	@Override
	public Page<Boards> findByTitle(String title, Pageable pageable) {
		title = "%" + title + "%";
		List<Boards> content = queryFactory
			.selectFrom(boards)
			.where(boards.title.like(title))
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.orderBy(boards.createdAt.desc())
			.fetch();
		long total = queryFactory
			.selectFrom(boards)
			.where(boards.category.like(title))
			.fetchCount();
		return new PageImpl<>(content, pageable, total);
	}

	@Override
	public void plusLikeCount(Long boardId) {
		queryFactory
			.update(boards)
			.where(boards.boardId.eq(boardId))
			.set(boards.likeCount, boards.likeCount.add(1))
			.execute();
	}

	@Override
	public void minusLikeCount(Long boardId) {
		queryFactory
			.update(boards)
			.where(boards.boardId.eq(boardId))
			.set(boards.likeCount, boards.likeCount.subtract(1))
			.execute();
	}

	@Override
	public void plusCommentCount(Long boardId) {
		queryFactory
			.update(boards)
			.where(boards.boardId.eq(boardId))
			.set(boards.commentCount, boards.commentCount.add(1))
			.execute();
	}

	@Override
	public void minusCommentCount(Long boardId) {
		queryFactory
			.update(boards)
			.where(boards.boardId.eq(boardId))
			.set(boards.commentCount, boards.commentCount.subtract(1))
			.execute();
	}

	@Override
	public Page<Boards> findSavedBoardsByUserId(Long userId, Pageable pageable) {
		QSave savedBoards = QSave.save;

		List<Boards> results = queryFactory
			.selectFrom(boards)
			.join(savedBoards).on(boards.boardId.eq(savedBoards.boardId))
			.where(savedBoards.userId.eq(userId))
			.orderBy(savedBoards.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		long total = queryFactory
			.selectFrom(boards)
			.join(savedBoards).on(boards.boardId.eq(savedBoards.boardId))
			.where(savedBoards.userId.eq(userId))
			.fetchCount();

		return new PageImpl<>(results, pageable, total);
	}

	@Override
	public CountResponseDto countAllById(Long userId) {
		QBoards boards = QBoards.boards;
		QReview qReview = QReview.review;
		QProduct qProduct = QProduct.product;

		Long boardCount = queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.userId.eq(userId))
			.fetchOne();

		Long reviewCount = queryFactory
			.select(qReview.count())
			.from(qReview)
			.where(qReview.reviewer.userId.eq(userId))
			.fetchOne();

		Long productCount = queryFactory
			.select(qProduct.count())
			.from(qProduct)
			.where(qProduct.userId.eq(userId))
			.fetchOne();

		return new CountResponseDto(boardCount, productCount, reviewCount);
	}
}

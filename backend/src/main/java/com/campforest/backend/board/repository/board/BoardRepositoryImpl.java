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

	@Override
	public List<Boards> findTopN(int limit) {
		return queryFactory
			.selectFrom(boards)
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public List<Boards> findNextN(Long cursorId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.boardId.lt(cursorId))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}
	public List<Boards> findByUserIdTopN(Long userId, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where(boards.userId.eq(userId))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	public List<Boards> findByUserIdNextN(Long userId, Long cursorId, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where(boards.userId.eq(userId)
				.and(boards.boardId.lt(cursorId)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}
	public List<Boards> findByCategoryTopN(String category, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where(boards.category.eq(category))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	public List<Boards> findByCategoryNextN(String category, Long cursorId, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where(boards.category.eq(category)
				.and(boards.boardId.lt(cursorId)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}
	public List<Boards> findByTitleAndContentTopN(String keyword, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where(boards.title.like("%" + keyword + "%")
			.or(boards.content.like("%" + keyword + "%")))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	public List<Boards> findByTitleAndContentNextN(String keyword, Long cursorId, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where((boards.title.like("%" + keyword + "%")
				.or(boards.content.like("%" + keyword + "%")))
				.and(boards.boardId.lt(cursorId)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public List<Boards> findSavedBoardsByUserIdTopN(Long userId, int limit) {
		QSave savedBoards = QSave.save;

		return queryFactory
			.selectFrom(boards)
			.join(savedBoards).on(boards.boardId.eq(savedBoards.boardId))
			.where(savedBoards.userId.eq(userId))
			.orderBy(savedBoards.boardId.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public List<Boards> findSavedBoardsByUserIdNextN(Long userId, Long cursorId, int limit) {
		QSave savedBoards = QSave.save;

		return queryFactory
			.selectFrom(boards)
			.join(savedBoards).on(boards.boardId.eq(savedBoards.boardId))
			.where(savedBoards.userId.eq(userId)
				.and(savedBoards.boardId.lt(cursorId)))
			.orderBy(savedBoards.boardId.desc())
			.limit(limit)
			.fetch();
	}
}

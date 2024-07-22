package com.campforest.backend.board.repository.like;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.QBoards;
import com.campforest.backend.board.entity.QLikes;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.util.List;

public class LikeRepositoryImpl implements LikeRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final QLikes likes = QLikes.likes;

	public LikeRepositoryImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public boolean existsByBoardIdAndUserId(Long boardId, Long userId) {
		return queryFactory
			.selectFrom(likes)
			.where(likes.boardId.eq(boardId).and(likes.userId.eq(userId)))
			.fetchFirst() != null;
	}

	@Override
	public void deleteByBoardIdAndUserId(Long boardId, Long userId) {
		queryFactory
			.delete(likes)
			.where(likes.boardId.eq(boardId).and(likes.userId.eq(userId)))
			.execute();
	}

	@Override
	public Long countAllByBoardId(Long boardId) {
		return queryFactory
			.select(likes.count())
			.from(likes)
			.where(likes.boardId.eq(boardId))
			.fetchOne();
	}
}

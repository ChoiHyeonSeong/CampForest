package com.campforest.backend.board.repository.save;

import java.util.List;

import com.campforest.backend.board.entity.QSave;
import com.querydsl.jpa.impl.JPAQueryFactory;

public class SaveRepositoryImpl implements SaveRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final QSave save = QSave.save;

	public SaveRepositoryImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public boolean existsByBoardIdAndUserId(Long boardId, Long userId) {
		return queryFactory
			.selectFrom(save)
			.where(save.boardId.eq(boardId).and(save.userId.eq(userId)))
			.fetchFirst() != null;

	}

	@Override
	public void deleteByBoardIdAndUserId(Long boardId, Long userId) {
		queryFactory
			.delete(save)
			.where(save.boardId.eq(boardId).and(save.userId.eq(userId)))
			.execute();
	}

	@Override
	public List<Long> findBoardIdsByUserId(Long nowId) {
		return queryFactory
			.select(save.boardId)
			.from(save)
			.where(save.userId.eq(nowId))
			.fetch();
	}
}

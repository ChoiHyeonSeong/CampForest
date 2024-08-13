package com.campforest.backend.board.repository.board;

import com.campforest.backend.board.dto.CountResponseDto;
import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.QBoards;
import com.campforest.backend.board.entity.QSave;
import com.campforest.backend.product.model.QProduct;
import com.campforest.backend.review.model.QReview;
import com.campforest.backend.user.model.QFollow;
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
	private final QFollow follow = QFollow.follow;
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
	public List<Boards> findTopN(Long nowId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.isBoardOpen.isTrue().or(
				boards.isBoardOpen.isFalse().and(
					JPAExpressions
						.selectOne()
						.from(QFollow.follow)
						.where(QFollow.follow.follower.userId.eq(boards.userId)
							.and(QFollow.follow.followee.userId.eq(nowId)))
						.exists()
				)
			))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public List<Boards> findNextN(Long nowId, Long cursorId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(
				boards.boardId.lt(cursorId)
					.and(
						boards.isBoardOpen.isTrue().or(
							boards.isBoardOpen.isFalse().and(
								JPAExpressions
									.selectOne()
									.from(QFollow.follow)
									.where(QFollow.follow.follower.userId.eq(boards.userId)
										.and(QFollow.follow.followee.userId.eq(nowId)))
									.exists()
							)
						)
					)
			)
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}
	@Override
	public List<Boards> findByUserIdTopN(Long nowId, Long userId, int limit) {

		return queryFactory
			.selectFrom(boards)
			.where(boards.userId.eq(userId)
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public  List<Boards> findByUserIdNextN(Long nowId, Long userId, Long cursorId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.userId.eq(userId)
				.and(boards.boardId.lt(cursorId))
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}
	public List<Boards> findByCategoryTopN(Long nowId, String category, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.category.eq(category)
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	public List<Boards> findByCategoryNextN(Long nowId, String category, Long cursorId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.category.eq(category)
				.and(boards.boardId.lt(cursorId))
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}
	public List<Boards> findByTitleAndContentTopN(Long nowId, String keyword, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where((boards.title.like("%" + keyword + "%")
				.or(boards.content.like("%" + keyword + "%")))
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	public List<Boards> findByTitleAndContentNextN(Long nowId, String keyword, Long cursorId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where((boards.title.like("%" + keyword + "%")
				.or(boards.content.like("%" + keyword + "%")))
				.and(boards.boardId.lt(cursorId))
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
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

	@Override
	public Long getUsersBoardCount(Long userId) {
		return queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.userId.eq(userId))
			.fetchOne();

	}
	public Long getCategoryBoardCount(String category) {
		return queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.category.eq(category))
			.fetchOne();

	}


	public Long getKeywordBoardCount(String keyword) {
		return queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.title.like("%" + keyword + "%")
			.or(boards.content.like("%"+keyword+"%")))
			.fetchOne();

	}

	@Override
	public Long getSavedBoardCount(Long nowId) {
		QSave save = QSave.save;
		return queryFactory
			.select(save.count())
			.from(save)
			.where(save.userId.eq(nowId))
			.fetchOne();
	}


	public Long countAll(Long nowId) {
		Long count = queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.isBoardOpen.isTrue().or(
				boards.isBoardOpen.isFalse().and(
					JPAExpressions
						.selectOne()
						.from(QFollow.follow)
						.where(QFollow.follow.follower.userId.eq(boards.userId)
							.and(QFollow.follow.followee.userId.eq(nowId)))
						.exists()
				)
			))
			.fetchOne();
		return count != null ? count : 0;
	}


	public Long countByUserId(Long nowId, Long userId) {
		Long count = queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.userId.eq(userId)
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.fetchOne();
		return count != null ? count : 0;
	}


	public Long countByCategory(Long userId, String category) {
		Long count = queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.category.eq(category)
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(userId)))
							.exists()
					)
				)))
			.fetchOne();
		return count != null ? count : 0;
	}


	public Long countByKeyword(Long nowId, String keyword) {
		Long count = queryFactory
			.select(boards.count())
			.from(boards)
			.where((boards.title.like("%" + keyword + "%")
				.or(boards.content.like("%" + keyword + "%")))
				.and(boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(nowId)))
							.exists()
					)
				)))
			.fetchOne();
		return count != null ? count : 0;
	}

	public Long countSavedByUserId(Long userId) {
		QSave savedBoards = QSave.save;

		Long count = queryFactory
			.select(boards.count())
			.from(boards)
			.join(savedBoards).on(boards.boardId.eq(savedBoards.boardId))
			.where(savedBoards.userId.eq(userId))
			.fetchOne();
		return count != null ? count : 0;
	}

	public List<Boards> findFollowingTopN(Long currentUserId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.userId.in(
				JPAExpressions
					.select(QFollow.follow.followee.userId)
					.from(QFollow.follow)
					.where(QFollow.follow.follower.userId.eq(currentUserId))
			).and(
				boards.isBoardOpen.isTrue().or(
					boards.isBoardOpen.isFalse().and(
						JPAExpressions
							.selectOne()
							.from(QFollow.follow)
							.where(QFollow.follow.follower.userId.eq(boards.userId)
								.and(QFollow.follow.followee.userId.eq(currentUserId)))
							.exists()
					)
				)
			))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	public List<Boards> findFollowingNextN(Long currentUserId, Long cursorId, int limit) {
		return queryFactory
			.selectFrom(boards)
			.where(boards.userId.in(
					JPAExpressions
						.select(QFollow.follow.followee.userId)
						.from(QFollow.follow)
						.where(QFollow.follow.follower.userId.eq(currentUserId))
				).and(boards.boardId.lt(cursorId))
				.and(
					boards.isBoardOpen.isTrue().or(
						boards.isBoardOpen.isFalse().and(
							JPAExpressions
								.selectOne()
								.from(QFollow.follow)
								.where(QFollow.follow.follower.userId.eq(boards.userId)
									.and(QFollow.follow.followee.userId.eq(currentUserId)))
								.exists()
						)
					)
				))
			.orderBy(boards.createdAt.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public Long countByFollow(Long nowId) {
		Long count =queryFactory
			.select(boards.count())
			.from(boards)
			.where(boards.userId.in(
					JPAExpressions
						.select(QFollow.follow.followee.userId)
						.from(QFollow.follow)
						.where(QFollow.follow.follower.userId.eq(nowId))
				).and(
					boards.isBoardOpen.isTrue().or(
						boards.isBoardOpen.isFalse().and(
							JPAExpressions
								.selectOne()
								.from(QFollow.follow)
								.where(QFollow.follow.follower.userId.eq(boards.userId)
									.and(QFollow.follow.followee.userId.eq(nowId)))
								.exists()
						)
					)
				))
			.orderBy(boards.createdAt.desc())
			.fetchOne();
		return count != null ? count : 0;
	}

	}



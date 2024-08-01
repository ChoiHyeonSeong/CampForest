package com.campforest.backend.board.repository.comment;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.entity.QBoards;
import com.campforest.backend.board.entity.QComment;
import com.querydsl.jpa.impl.JPAQueryFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public class CommentRepositoryImpl implements CommentRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final QComment comment = QComment.comment;

	public CommentRepositoryImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public List<Comment> findByCommentWriterId(Long commentWriterId) {
		return queryFactory
			.selectFrom(comment)
			.where(comment.commentId.eq(commentWriterId))
			.fetch();
	}

	@Override
	public Long countAllByBoardId(Long boardId) {
		return queryFactory
			.select(comment.count())
			.from(comment)
			.where(comment.boardId.eq(boardId))
			.fetchOne();
	}

	@Override
	public Page<Comment> findByBoardId(Long boardId, Pageable pageable) {
		List<Comment> content = queryFactory
			.selectFrom(comment)
			.where(comment.boardId.eq(boardId))
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.orderBy(comment.createdAt.desc())
			.fetch();
		long total = queryFactory
			.selectFrom(comment)
			.where(comment.boardId.eq(boardId))
			.fetchCount();
		return new PageImpl<>(content, pageable, total);
	}

	@Override
	public Long findByCommentId(Long commentId) {
		return queryFactory
			.select(comment.boardId)  // board의 boardId를 선택합니다
			.from(comment)
			.where(comment.commentId.eq(commentId))
			.fetchOne();
	}

	@Override
	public void plusLikeCount(Long commentId) {
		queryFactory
			.update(comment)
			.where(comment.commentId.eq(commentId))
			.set(comment.likeCount, comment.likeCount.add(1))
			.execute();
	}

	@Override
	public void minusLikeCount(Long commentId) {
		queryFactory
			.update(comment)
			.where(comment.boardId.eq(commentId))
			.set(comment.likeCount, comment.likeCount.subtract(1))
			.execute();
	}
}

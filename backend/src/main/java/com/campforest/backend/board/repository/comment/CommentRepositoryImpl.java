package com.campforest.backend.board.repository.comment;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.entity.QBoards;
import com.campforest.backend.board.entity.QComment;
import com.querydsl.jpa.impl.JPAQueryFactory;

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
	public List<Comment> findAllByBoardId(Long boardId) {
		return queryFactory
			.selectFrom(comment)
			.where(comment.boardId.eq(boardId))
			.fetch();
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
}

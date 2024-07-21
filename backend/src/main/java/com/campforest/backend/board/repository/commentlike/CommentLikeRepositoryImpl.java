package com.campforest.backend.board.repository.commentlike;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.entity.QBoards;
import com.campforest.backend.board.entity.QCommentLikes;
import com.campforest.backend.board.repository.board.BoardRepositoryCustom;
import com.campforest.backend.board.repository.comment.CommentRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.util.List;

public class CommentLikeRepositoryImpl implements CommentLikeRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QCommentLikes commentLikes = QCommentLikes.commentLikes;

    public CommentLikeRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }
    @Override
    public boolean existsByCommentIdAndUserId(Long commentId, Long userId) {
        return queryFactory
                .selectFrom(commentLikes)
                .where(commentLikes.commentId.eq(commentId).and(commentLikes.userId.eq(userId)))
                .fetchFirst() != null;
    }

    @Override
    public void deleteByCommentIdAndUserId(Long commentId, Long userId) {
        queryFactory
                .delete(commentLikes)
                .where(commentLikes.commentId.eq(commentId).and(commentLikes.userId.eq(userId)))
                .execute();
    }

    @Override
    public Long countAllByCommentId(Long commentId) {
        return queryFactory
                .select(commentLikes.count())
                .from(commentLikes)
                .where(commentLikes.commentId.eq(commentId))
                .fetchOne();
    }
}

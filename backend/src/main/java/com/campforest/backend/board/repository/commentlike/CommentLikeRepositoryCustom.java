package com.campforest.backend.board.repository.commentlike;

public interface CommentLikeRepositoryCustom {
    boolean existsByCommentIdAndUserId(Long commentId, Long userId);

    void deleteByCommentIdAndUserId(Long commentId, Long userId);

    Long countAllByCommentId(Long commentId);
}

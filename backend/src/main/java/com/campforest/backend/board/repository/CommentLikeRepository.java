package com.campforest.backend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.board.entity.CommentLikes;

public interface CommentLikeRepository extends JpaRepository <CommentLikes,Long>{

	boolean existsByCommentIdAndUserId(Long commentId, Long userId);

	void deleteByCommentIdAndUserId(Long commentId, Long userId);

	Long countAllByCommentId(Long commentId);
}

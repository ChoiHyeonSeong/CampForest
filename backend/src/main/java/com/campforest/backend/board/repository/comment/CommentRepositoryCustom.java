package com.campforest.backend.board.repository.comment;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepositoryCustom {

	List<Comment> findByCommentWriterId(Long commentWriterId);

	Long countAllByBoardId(Long boardId);

	Page<Comment> findByBoardId(Long boardId, Pageable pageable);

	Long findByCommentId(Long commentId);

	void plusLikeCount(Long boardId);

	void minusLikeCount(Long boardId);

}

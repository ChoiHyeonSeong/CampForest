package com.campforest.backend.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
	@Query("SELECT c FROM Comment c WHERE c.boardId = :boardId")
	List<Comment> findAllByBoardId(@Param("boardId") Long boardId);

	@Query("SELECT c FROM Comment c WHERE c.commentWriterId = :commentWriterId")
	List<Comment> findByUserId(@Param("userId") Long userId);
}

package com.campforest.backend.board.repository;

import java.util.List;

import com.campforest.backend.board.dto.BoardRequestDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Boards;
@Repository
public interface BoardRepository extends JpaRepository<Boards,Long> {

	@Query("SELECT b FROM Boards b WHERE b.userId = :userId")
	List<Boards> findByUserId(@Param("userId") Long userId);
	@Modifying
	@Query("UPDATE Boards b SET b.title = :title, b.content = :content, b.category = :category, b.isBoardOpen = :isBoardOpen WHERE b.boardId = :boardId")
	void updateBoard(@Param("boardId") Long boardId,
					 @Param("title") String title,
					 @Param("content") String content,
					 @Param("category") String category,
					 @Param("isBoardOpen") boolean isBoardOpen);
}

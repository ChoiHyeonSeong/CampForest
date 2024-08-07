package com.campforest.backend.board.repository.board;

import com.campforest.backend.board.dto.CountResponseDto;
import com.campforest.backend.board.entity.Boards;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
	void plusLikeCount(Long boardId);

	void minusLikeCount(Long boardId);

	void plusCommentCount(Long boardId);

	void minusCommentCount(Long boardId);

	CountResponseDto countAllById(Long userId);

	List<Boards> findTopN(int i);

	List<Boards> findNextN(Long cursorId, int i);


	List<Boards> findByUserIdTopN(Long userId, int limit);
	 List<Boards> findByUserIdNextN(Long userId, Long cursorId, int limit) ;

	List<Boards> findByCategoryTopN(String category, int limit);
	 List<Boards> findByCategoryNextN(String category, Long cursorId, int limit);

	List<Boards> findByTitleAndContentTopN(String keyword, int limit);
	List<Boards> findByTitleAndContentNextN(String keyword, Long cursorId, int limit);

	List<Boards> findSavedBoardsByUserIdTopN(Long nowId, int limit);
	List<Boards> findSavedBoardsByUserIdNextN(Long nowId, Long cursorId, int limit);
}

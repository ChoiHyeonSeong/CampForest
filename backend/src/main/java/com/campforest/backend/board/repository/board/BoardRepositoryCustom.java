package com.campforest.backend.board.repository.board;

import com.campforest.backend.board.entity.Boards;

import java.util.List;

public interface BoardRepositoryCustom {
	List<Boards> findByUserId(Long userId);

	List<Boards> findByCategory(String category);

	void plusLikeCount(Long boardId);

	void minusLikeCount(Long boardId);

}

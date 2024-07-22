package com.campforest.backend.board.repository.save;

public interface SaveRepositoryCustom {
	boolean existsByBoardIdAndUserId(Long boardId, Long userId);

	void deleteByBoardIdAndUserId(Long boardId, Long userId);
}

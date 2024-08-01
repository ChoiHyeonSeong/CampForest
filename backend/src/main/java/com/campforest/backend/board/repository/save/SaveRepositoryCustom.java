package com.campforest.backend.board.repository.save;

import java.util.List;

public interface SaveRepositoryCustom {
	boolean existsByBoardIdAndUserId(Long boardId, Long userId);

	void deleteByBoardIdAndUserId(Long boardId, Long userId);

	List<Long> findBoardIdsByUserId(Long nowId);
}

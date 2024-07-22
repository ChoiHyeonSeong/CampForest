package com.campforest.backend.board.repository.like;

import com.campforest.backend.board.entity.Boards;

import java.util.List;

public interface LikeRepositoryCustom {
	boolean existsByBoardIdAndUserId(Long boardId, Long userId);

	void deleteByBoardIdAndUserId(Long boardId, Long userId);

	Long countAllByBoardId(Long boardId);
}

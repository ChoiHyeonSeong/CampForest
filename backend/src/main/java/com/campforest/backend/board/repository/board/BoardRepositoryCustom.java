package com.campforest.backend.board.repository.board;

import com.campforest.backend.board.entity.Boards;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
	Page<Boards> findByUserId(Long userId, Pageable pageable);

	List<Boards> findByCategory(String category);

	void plusLikeCount(Long boardId);

	void minusLikeCount(Long boardId);

}

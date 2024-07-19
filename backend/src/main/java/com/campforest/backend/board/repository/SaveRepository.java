package com.campforest.backend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Save;

@Repository
public interface SaveRepository extends JpaRepository<Save, Long> {
	boolean existsByBoardIdAndUserId(Long boardId, Long userId);

	void deleteByBoardIdAndUserId(Long boardId, Long userId);
}

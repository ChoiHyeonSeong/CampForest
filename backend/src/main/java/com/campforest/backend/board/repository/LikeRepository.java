package com.campforest.backend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Likes;

@Repository
public interface LikeRepository extends JpaRepository<Likes, Long> {
	boolean existsByBoardIdAndUserId(Long boardId, Long userId);

	void deleteByBoardIdAndUserId(Long boardId, Long userId);

	Long countAllByBoardId(Long boardId);
}

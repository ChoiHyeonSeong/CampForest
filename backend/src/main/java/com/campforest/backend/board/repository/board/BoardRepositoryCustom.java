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

	List<Boards> findTopN(Long nowId, int i);

	List<Boards> findNextN(Long nowId, Long cursorId, int i);


	List<Boards> findByUserIdTopN(Long nowId, Long userId, int limit);
	 List<Boards> findByUserIdNextN(Long nowId,Long userId, Long cursorId, int limit) ;

	List<Boards> findByCategoryTopN(Long nowId, String category, int limit);
	 List<Boards> findByCategoryNextN(Long nowId, String category, Long cursorId, int limit);

	List<Boards> findByTitleAndContentTopN(Long nowId, String keyword, int limit);
	List<Boards> findByTitleAndContentNextN(Long nowId, String keyword, Long cursorId, int limit);

	List<Boards> findSavedBoardsByUserIdTopN(Long nowId, int limit);
	List<Boards> findSavedBoardsByUserIdNextN(Long nowId, Long cursorId, int limit);

	Long getUsersBoardCount(Long userId);
	Long getCategoryBoardCount(String category) ;

	Long getKeywordBoardCount(String keyword);

	Long getSavedBoardCount(Long nowId);

	Long countAll(Long nowId);
	Long countByUserId(Long nowId, Long userId);
	Long countByCategory(Long nowId, String category);
	Long countByKeyword(Long nowId, String keyword);
	Long countSavedByUserId(Long userId);

	List<Boards> findFollowingTopN(Long nowId, int i);

	List<Boards> findFollowingNextN(Long nowId, Long cursorId, int i);

	Long countByFollow(Long nowId);
}

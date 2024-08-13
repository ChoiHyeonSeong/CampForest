package com.campforest.backend.board.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.dto.CountResponseDto;
import com.campforest.backend.board.dto.SearchResult;
import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.common.CursorResult;

public interface BoardService {
	void writeBoard(BoardRequestDto boardRequestDto);

	BoardResponseDto getBoard(Long nowId, Long boardId);

	CursorResult<BoardResponseDto> getAllBoards(Long nowId, Long cursorId, int size);

	CursorResult<BoardResponseDto> getFollowingBoards(Long nowId, Long cursorId,int size);

	SearchResult<BoardResponseDto> getUserBoards(Long nowId,Long userId, Long cursorId, int size);

	SearchResult<BoardResponseDto> getKeywordBoards(Long nowId,String title, Long cursorId, int size);

	SearchResult<BoardResponseDto> getCategoryBoards(Long nowId,String category, Long cursorId, int size);

	SearchResult<BoardResponseDto> getSavedBoards(Long nowId, Long cursorId, int size);

	Boards findByBoardId(Long boardId);

	void modifyBoard(Long boardId, BoardRequestDto boardRequestDto);

	void deleteBoard(Long boardId);

	void likeBoard(Long boardId, Long userId);

	void deleteLike(Long boardId, Long userId);

	boolean checkLike(Long boardId, Long userId);

	Long countBoardLike(Long boardID);

	void saveBoard(Long boardId, Long userId);

	void deleteSave(Long boardId, Long userId);

	boolean checkSave(Long boardId, Long userId);

	void writeComment(Long boardId, CommentRequestDto commentRequestDto);

	Page<CommentResponseDto> getComments(Long nowId,Long boardId, int page, int size);

	List<CommentResponseDto> getUserComment(Long commentWriterId);

	void deleteComment(Long commentId);

	Long countBoardComment(Long boardId);

	void likeComment(Long commentId, Long userId);

	void deleteCommentLike(Long commentId, Long userId);

	boolean checkCommentLike(Long commentId, Long userId);

	Long countCommentLike(Long commentId);

	Comment getCommentById(Long commentId);

	CountResponseDto countAll(Long userId);
}

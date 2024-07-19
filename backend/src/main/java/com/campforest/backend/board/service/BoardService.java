package com.campforest.backend.board.service;

import java.util.List;

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;

public interface BoardService {
	void writeBoard(BoardRequestDto boardRequestDto);

	BoardResponseDto getBoard(Long boardId);

	List<BoardResponseDto> getAllBoards();

	List<BoardResponseDto> getUserBoards(Long userId);

	List<BoardResponseDto> getCategoryBoards(String category);

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

	List<CommentResponseDto> getComment(Long boardId);

	List<CommentResponseDto> getUserComment(Long commentWriterId);

	void deleteComment(Long commentId);

	Long countBoardComment(Long boardId);


	void likeComment ( Long commentId, Long userId );

	void deleteCommentLike ( Long commentId, Long userId );

	boolean checkCommentLike(Long commentId, Long userId);
	Long countCommentLike(Long commentId);
}

package com.campforest.backend.board.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.entity.Comment;

public interface BoardService {
	void writeBoard(BoardRequestDto boardRequestDto);

	BoardResponseDto getBoard(Long nowId, Long boardId);

	Page<BoardResponseDto> getAllBoards(Long nowId, int page, int size);

	Page<BoardResponseDto> getUserBoards(Long nowId,Long userId, int page, int size);

	Page<BoardResponseDto> getTitleBoards(Long nowId,String title, int page, int size);

	Page<BoardResponseDto> getCategoryBoards(Long nowId,String category, int page, int size);

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

	Page<BoardResponseDto> getSavedBoards(Long nowId, int page, int size);

	Comment getCommentById(Long commentId);
}
package com.campforest.backend.board.service;

import com.campforest.backend.board.controller.BoardController;
import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.service.BoardService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.config.s3.S3Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BoardServiceTest {

	@InjectMocks
	private BoardController boardController;

	@Mock
	private BoardService boardService;

	@Mock
	private S3Service s3Service;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testWriteBoard() throws IOException {
		BoardRequestDto boardRequestDto = new BoardRequestDto();
		boardRequestDto.setUserId(1L);
		boardRequestDto.setTitle("Test Title");
		boardRequestDto.setContent("Test Content");
		boardRequestDto.setCategory("Test Category");
		boardRequestDto.setBoardOpen(true);

		MockMultipartFile file = new MockMultipartFile(
			"files", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes()
		);

		when(s3Service.upload(anyString(), any(MultipartFile.class), anyString()))
			.thenReturn("https://s3-url.com/test.jpg");

		ApiResponse<?> response = boardController.writeBoard(new MultipartFile[] {file}, boardRequestDto);

		assertNotNull(response);
		assertEquals("게시물 작성에 성공하였습니다.", response.getMessage());
		verify(boardService, times(1)).writeBoard(any(BoardRequestDto.class));
	}

	@Test
	void testGetBoard() {
		Long boardId = 1L;
		BoardResponseDto boardResponseDto = new BoardResponseDto();
		when(boardService.getBoard(boardId)).thenReturn(boardResponseDto);

		ApiResponse<BoardResponseDto> response = boardController.getBoard(boardId);

		assertNotNull(response);
		assertEquals("게시글 단일 조회 성공", response.getMessage());
		assertEquals(boardResponseDto, response.getData());
	}

	@Test
	void testGetAllBoard() {
		int page = 0;
		int size = 10;
		Page<BoardResponseDto> boardPage = new PageImpl<>(new ArrayList<>());
		when(boardService.getAllBoards(page, size)).thenReturn(boardPage);

		ApiResponse<Page<BoardResponseDto>> response = boardController.getAllBoard(page, size);

		assertNotNull(response);
		assertEquals("게시글 목록 조회 성공하였습니다", response.getMessage());
		assertEquals(boardPage, response.getData());
	}

	@Test
	void testGetUserBoard() {
		Long userId = 1L;
		List<BoardResponseDto> boardList = new ArrayList<>();
		when(boardService.getUserBoards(userId)).thenReturn(boardList);

		ApiResponse<List<BoardResponseDto>> response = boardController.getUserBoard(userId);

		assertNotNull(response);
		assertEquals("게시글 사용자별 조회에 성공하였습니다", response.getMessage());
		assertEquals(boardList, response.getData());
	}

	@Test
	void testGetCategoryBoard() {
		String category = "Test Category";
		List<BoardResponseDto> boardList = new ArrayList<>();
		when(boardService.getCategoryBoards(category)).thenReturn(boardList);

		ApiResponse<List<BoardResponseDto>> response = boardController.getCategoryBoard(category);

		assertNotNull(response);
		assertEquals("게시글 카테고리별 조회에 성공하였습니다", response.getMessage());
		assertEquals(boardList, response.getData());
	}

	@Test
	void testModifyBoard() {
		Long boardId = 1L;
		BoardRequestDto boardRequestDto = new BoardRequestDto();
		boardRequestDto.setTitle("수정된 제목");
		boardRequestDto.setContent("수정된 내용");
		boardRequestDto.setCategory("수정된 카테고리");
		boardRequestDto.setBoardOpen(true);
		boardRequestDto.setImageUrls(Arrays.asList("http://example.com/image1.jpg", "http://example.com/image2.jpg"));

		ApiResponse<?> response = boardController.modifyBoard(boardId, boardRequestDto);

		assertNotNull(response);
		assertEquals("게시물 수정에 성공하였습니다.", response.getMessage());
		verify(boardService, times(1)).modifyBoard(boardId, boardRequestDto);
	}

	@Test
	void testDeleteBoard() {
		Long boardId = 1L;

		ApiResponse<?> response = boardController.deleteBoard(boardId);

		assertNotNull(response);
		assertEquals("게시글 삭제 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).deleteBoard(boardId);
	}

	@Test
	void testLikeBoard() {
		Long boardId = 1L;
		Long userId = 1L;

		when(boardService.checkLike(boardId, userId)).thenReturn(false);

		ApiResponse<?> response = boardController.likeBoard(boardId, userId);

		assertNotNull(response);
		assertEquals("게시글 좋아요 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).likeBoard(boardId, userId);
	}

	@Test
	void testUnlikeBoard() {
		Long boardId = 1L;
		Long userId = 1L;

		when(boardService.checkLike(boardId, userId)).thenReturn(true);

		ApiResponse<?> response = boardController.likeBoard(boardId, userId);

		assertNotNull(response);
		assertEquals("게시글 좋아요 삭제 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).deleteLike(boardId, userId);
	}

	@Test
	void testCountBoardLike() {
		Long boardId = 1L;
		Long likeCount = 5L;
		when(boardService.countBoardLike(boardId)).thenReturn(likeCount);

		ApiResponse<Long> response = boardController.countBoardLike(boardId);

		assertNotNull(response);
		assertEquals("좋아요 개수 조회 성공하였습니다", response.getMessage());
		assertEquals(likeCount, response.getData());
	}

	@Test
	void testSaveBoard() {
		Long boardId = 1L;
		Long userId = 1L;

		when(boardService.checkSave(boardId, userId)).thenReturn(false);

		ApiResponse<?> response = boardController.saveBoard(boardId, userId);

		assertNotNull(response);
		assertEquals("게시글 저장 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).saveBoard(boardId, userId);
	}

	@Test
	void testUnsaveBoard() {
		Long boardId = 1L;
		Long userId = 1L;

		when(boardService.checkSave(boardId, userId)).thenReturn(true);

		ApiResponse<?> response = boardController.saveBoard(boardId, userId);

		assertNotNull(response);
		assertEquals("저장 삭제 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).deleteSave(boardId, userId);
	}

	@Test
	void testWriteComment() {
		Long boardId = 1L;
		CommentRequestDto commentRequestDto = new CommentRequestDto();

		ApiResponse<?> response = boardController.writeComment(boardId, commentRequestDto);

		assertNotNull(response);
		assertEquals("댓글 작성 성공", response.getMessage());
		verify(boardService, times(1)).writeComment(boardId, commentRequestDto);
	}

	@Test
	void testGetComment() {
		Long boardId = 1L;
		List<CommentResponseDto> commentList = new ArrayList<>();
		when(boardService.getComment(boardId)).thenReturn(commentList);

		ApiResponse<List<CommentResponseDto>> response = boardController.getComment(boardId);

		assertNotNull(response);
		assertEquals("댓글 게시글별 조회에 성공하였습니다", response.getMessage());
		assertEquals(commentList, response.getData());
	}

	@Test
	void testGetUserComment() {
		Long commentWriterId = 1L;
		List<CommentResponseDto> commentList = new ArrayList<>();
		when(boardService.getUserComment(commentWriterId)).thenReturn(commentList);

		ApiResponse<List<CommentResponseDto>> response = boardController.getUserComment(commentWriterId);

		assertNotNull(response);
		assertEquals("댓글 유저별 조회에 성공하였습니다", response.getMessage());
		assertEquals(commentList, response.getData());
	}

	@Test
	void testDeleteComment() {
		Long commentId = 1L;

		ApiResponse<?> response = boardController.deleteComment(commentId);

		assertNotNull(response);
		assertEquals("댓글 삭제 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).deleteComment(commentId);
	}

	@Test
	void testCountBoardComment() {
		Long boardId = 1L;
		Long commentCount = 3L;
		when(boardService.countBoardComment(boardId)).thenReturn(commentCount);

		ApiResponse<Long> response = boardController.countBoardComment(boardId);

		assertNotNull(response);
		assertEquals("댓글 개수 조회 성공하였습니다", response.getMessage());
		assertEquals(commentCount, response.getData());
	}

	@Test
	void testLikeComment() {
		Long commentId = 1L;
		Long userId = 1L;

		when(boardService.checkCommentLike(commentId, userId)).thenReturn(false);

		ApiResponse<?> response = boardController.likeComment(commentId, userId);

		assertNotNull(response);
		assertEquals("댓글 좋아요 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).likeComment(commentId, userId);
	}

	@Test
	void testUnlikeComment() {
		Long commentId = 1L;
		Long userId = 1L;

		when(boardService.checkCommentLike(commentId, userId)).thenReturn(true);

		ApiResponse<?> response = boardController.likeComment(commentId, userId);

		assertNotNull(response);
		assertEquals("댓글 좋아요 삭제 성공하였습니다", response.getMessage());
		verify(boardService, times(1)).deleteCommentLike(commentId, userId);
	}

	@Test
	void testCountCommentLike() {
		Long commentId = 1L;
		Long likeCount = 2L;
		when(boardService.countCommentLike(commentId)).thenReturn(likeCount);

		ApiResponse<Long> response = boardController.countCommentLike(commentId);

		assertNotNull(response);
		assertEquals("댓글 좋아요 수 조회 성공", response.getMessage());
		assertEquals(likeCount, response.getData());
	}
}
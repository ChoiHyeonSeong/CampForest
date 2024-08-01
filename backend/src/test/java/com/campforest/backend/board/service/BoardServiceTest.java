// package com.campforest.backend.board.service;
//
// import com.campforest.backend.board.controller.BoardController;
// import com.campforest.backend.board.dto.BoardRequestDto;
// import com.campforest.backend.board.dto.BoardResponseDto;
// import com.campforest.backend.board.dto.CommentRequestDto;
// import com.campforest.backend.board.dto.CommentResponseDto;
// import com.campforest.backend.board.service.BoardService;
// import com.campforest.backend.common.ApiResponse;
// import com.campforest.backend.config.s3.S3Service;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.http.MediaType;
// import org.springframework.mock.web.MockMultipartFile;
// import org.springframework.web.multipart.MultipartFile;
//
// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;
//
// import static org.mockito.Mockito.*;
// import static org.junit.jupiter.api.Assertions.*;
//
// class BoardServiceTest {
//
// 	@InjectMocks
// 	private BoardController boardController;
//
// 	@Mock
// 	private BoardService boardService;
//
// 	@Mock
// 	private S3Service s3Service;
//
// 	@BeforeEach
// 	void setUp() {
// 		MockitoAnnotations.openMocks(this);
// 	}
//
// 	// 더미 데이터 생성
// 	private BoardRequestDto createDummyBoardRequestDto() {
// 		BoardRequestDto dto = new BoardRequestDto();
// 		dto.setUserId(1L);
// 		dto.setTitle("Test Title");
// 		dto.setContent("Test Content");
// 		dto.setCategory("Test Category");
// 		dto.setBoardOpen(true);
// 		dto.setImageUrls(Arrays.asList("url1", "url2"));
// 		return dto;
// 	}
//
// 	private BoardResponseDto createDummyBoardResponseDto() {
// 		BoardResponseDto dto = new BoardResponseDto();
// 		dto.setBoardId(1L);
// 		dto.setUserId(1L);
// 		dto.setTitle("Test Title");
// 		dto.setContent("Test Content");
// 		dto.setCategory("Test Category");
// 		dto.setLikeCount(0L);
// 		dto.setBoardOpen(true);
// 		dto.setCreatedAt(LocalDateTime.now());
// 		dto.setModifiedAt(LocalDateTime.now());
// 		dto.setImageUrls(Arrays.asList("url1", "url2"));
// 		return dto;
// 	}
//
// 	private CommentRequestDto createDummyCommentRequestDto() {
// 		CommentRequestDto dto = new CommentRequestDto();
// 		dto.setCommentWriterId(1L);
// 		dto.setBoardId(1L);
// 		dto.setContent("Test Comment");
// 		return dto;
// 	}
//
// 	private CommentResponseDto createDummyCommentResponseDto() {
// 		CommentResponseDto dto = new CommentResponseDto();
// 		dto.setCommentId(1L);
// 		dto.setCommentWriterId(1L);
// 		dto.setBoardId(1L);
// 		dto.setContent("Test Comment");
// 		dto.setCreatedAt(LocalDateTime.now());
// 		return dto;
// 	}
//
// 	@Test
// 	void testWriteBoard() throws Exception {
// 		BoardRequestDto requestDto = createDummyBoardRequestDto();
// 		MockMultipartFile file = new MockMultipartFile("files", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes());
//
// 		when(s3Service.upload(anyString(), any(MultipartFile.class), anyString())).thenReturn("https://s3-url.com/test.jpg");
//
// 		ApiResponse<?> response = boardController.writeBoard(new MultipartFile[]{file}, requestDto);
//
// 		assertEquals("게시물 작성에 성공하였습니다.", response.getMessage());
// 		verify(boardService, times(1)).writeBoard(any(BoardRequestDto.class));
// 	}
//
// 	@Test
// 	void testGetBoard() {
// 		Long boardId = 1L;
// 		BoardResponseDto responseDto = createDummyBoardResponseDto();
//
// 		when(boardService.getBoard(boardId)).thenReturn(responseDto);
//
// 		ApiResponse<?> response = boardController.getBoard(boardId);
//
// 		assertEquals("게시글 단일 조회 성공", response.getMessage());
// 		assertEquals(responseDto, response.getData());
// 	}
//
// 	@Test
// 	void testGetAllBoard() {
// 		Long userId = 1L;
// 		int page = 0;
// 		int size = 10;
// 		List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
// 		Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
// 		when(boardService.getAllBoards(userId,page, size)).thenReturn(boardPage);
//
// 		ApiResponse<?> response = boardController.getAllBoard(userId,page, size);
//
// 		assertEquals("게시글 목록 조회 성공하였습니다", response.getMessage());
// 		assertEquals(boardPage, response.getData());
// 	}
//
// 	@Test
// 	void testWriteComment() {
// 		Long boardId = 1L;
// 		CommentRequestDto requestDto = createDummyCommentRequestDto();
//
// 		ApiResponse<?> response = boardController.writeComment(boardId, requestDto);
//
// 		assertEquals("댓글 작성 성공", response.getMessage());
// 		verify(boardService, times(1)).writeComment(boardId, requestDto);
// 	}
//
// 	@Test
// 	void testGetComment() {
// 		Long boardId = 1L;
// 		List<CommentResponseDto> commentList = Arrays.asList(createDummyCommentResponseDto(), createDummyCommentResponseDto());
//
// 		when(boardService.getComment(boardId)).thenReturn(commentList);
//
// 		ApiResponse<?> response = boardController.getComment(boardId);
//
// 		assertEquals("댓글 게시글별 조회에 성공하였습니다", response.getMessage());
// 		assertEquals(commentList, response.getData());
// 	}
//
//
// 	@Test
// 	void testGetUserBoard() {
// 		Long userId = 1L;
// 		int page = 0;
// 		int size = 10;
// 		List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
// 		Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
// 		when(boardService.getUserBoards(userId, page, size)).thenReturn(boardPage);
//
// 		ApiResponse<?> response = boardController.getUserBoard(userId, page, size);
//
// 		assertEquals("게시글 사용자별 조회에 성공하였습니다", response.getMessage());
// 		assertEquals(boardPage, response.getData());
// 	}
//
// 	@Test
// 	void testGetCategoryBoard() {
// 		String category = "Test Category";
// 		int page = 0;
// 		int size = 10;
// 		List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
// 		Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
// 		when(boardService.getCategoryBoards(category, page, size)).thenReturn(boardPage);
//
// 		ApiResponse<?> response = boardController.getCategoryBoard(category, page, size);
//
// 		assertEquals("게시글 카테고리별 조회에 성공하였습니다", response.getMessage());
// 		assertEquals(boardPage, response.getData());
// 	}
//
// 	@Test
// 	void testModifyBoard() {
// 		Long boardId = 1L;
// 		BoardRequestDto requestDto = createDummyBoardRequestDto();
//
// 		ApiResponse<?> response = boardController.modifyBoard(boardId, requestDto);
//
// 		assertEquals("게시물 수정에 성공하였습니다.", response.getMessage());
// 		verify(boardService, times(1)).modifyBoard(boardId, requestDto);
// 	}
//
// 	@Test
// 	void testDeleteBoard() {
// 		Long boardId = 1L;
//
// 		ApiResponse<?> response = boardController.deleteBoard(boardId);
//
// 		assertEquals("게시글 삭제 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).deleteBoard(boardId);
// 	}
//
// 	@Test
// 	void testLikeBoard() {
// 		Long boardId = 1L;
// 		Long userId = 1L;
//
// 		when(boardService.checkLike(boardId, userId)).thenReturn(false);
// 		when(boardService.getBoard(boardId)).thenReturn(createDummyBoardResponseDto());
//
// 		ApiResponse<?> response = boardController.likeBoard(boardId, userId);
//
// 		assertEquals("게시글 좋아요 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).likeBoard(boardId, userId);
// 	}
//
// 	@Test
// 	void testDeleteLike() {
// 		Long boardId = 1L;
// 		Long userId = 1L;
//
// 		when(boardService.checkLike(boardId, userId)).thenReturn(true);
// 		when(boardService.getBoard(boardId)).thenReturn(createDummyBoardResponseDto());
//
// 		ApiResponse<?> response = boardController.deleteLike(boardId, userId);
//
// 		assertEquals("게시글 좋아요 삭제 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).deleteLike(boardId, userId);
// 	}
//
// 	@Test
// 	void testCountBoardLike() {
// 		Long boardId = 1L;
// 		Long likeCount = 10L;
//
// 		when(boardService.countBoardLike(boardId)).thenReturn(likeCount);
//
// 		ApiResponse<?> response = boardController.countBoardLike(boardId);
//
// 		assertEquals("좋아요 개수 조회 성공하였습니다", response.getMessage());
// 		assertEquals(likeCount, response.getData());
// 	}
//
// 	@Test
// 	void testSaveBoard() {
// 		Long boardId = 1L;
// 		Long userId = 1L;
//
// 		when(boardService.checkSave(boardId, userId)).thenReturn(false);
//
// 		ApiResponse<?> response = boardController.saveBoard(boardId, userId);
//
// 		assertEquals("게시글 저장 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).saveBoard(boardId, userId);
// 	}
//
// 	@Test
// 	void testDeleteSave() {
// 		Long boardId = 1L;
// 		Long userId = 1L;
//
// 		ApiResponse<?> response = boardController.deleteSave(boardId, userId);
//
// 		assertEquals("저장 삭제 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).deleteSave(boardId, userId);
// 	}
//
// 	@Test
// 	void testGetUserComment() {
// 		Long commentWriterId = 1L;
// 		List<CommentResponseDto> commentList = Arrays.asList(createDummyCommentResponseDto(), createDummyCommentResponseDto());
//
// 		when(boardService.getUserComment(commentWriterId)).thenReturn(commentList);
//
// 		ApiResponse<?> response = boardController.getUserComment(commentWriterId);
//
// 		assertEquals("댓글 유저별 조회에 성공하였습니다", response.getMessage());
// 		assertEquals(commentList, response.getData());
// 	}
//
// 	@Test
// 	void testDeleteComment() {
// 		Long commentId = 1L;
//
// 		ApiResponse<?> response = boardController.deleteComment(commentId);
//
// 		assertEquals("댓글 삭제 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).deleteComment(commentId);
// 	}
//
// 	@Test
// 	void testCountBoardComment() {
// 		Long boardId = 1L;
// 		Long commentCount = 5L;
//
// 		when(boardService.countBoardComment(boardId)).thenReturn(commentCount);
//
// 		ApiResponse<?> response = boardController.countBoardComment(boardId);
//
// 		assertEquals("댓글 개수 조회 성공하였습니다", response.getMessage());
// 		assertEquals(commentCount, response.getData());
// 	}
//
// 	@Test
// 	void testLikeComment() {
// 		Long commentId = 1L;
// 		Long userId = 1L;
//
// 		when(boardService.checkCommentLike(commentId, userId)).thenReturn(false);
//
// 		ApiResponse<?> response = boardController.likeComment(commentId, userId);
//
// 		assertEquals("댓글 좋아요 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).likeComment(commentId, userId);
// 	}
//
// 	@Test
// 	void testDeleteCommentLike() {
// 		Long commentId = 1L;
// 		Long userId = 1L;
//
// 		ApiResponse<?> response = boardController.deleteCommentLike(commentId, userId);
//
// 		assertEquals("댓글 좋아요 삭제 성공하였습니다", response.getMessage());
// 		verify(boardService, times(1)).deleteCommentLike(commentId, userId);
// 	}
//
// 	@Test
// 	void testCountCommentLike() {
// 		Long commentId = 1L;
// 		Long likeCount = 3L;
//
// 		when(boardService.countCommentLike(commentId)).thenReturn(likeCount);
//
// 		ApiResponse<?> response = boardController.countCommentLike(commentId);
//
// 		assertEquals("댓글 좋아요 수 조회 성공", response.getMessage());
// 		assertEquals(likeCount, response.getData());
// 	}
//
// }
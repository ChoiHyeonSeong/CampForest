// package com.campforest.backend.board.service;
//
// import static com.campforest.backend.user.model.Role.ROLE_USER;
// import static org.mockito.Mockito.*;
// import static org.junit.jupiter.api.Assertions.*;
//
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.http.MediaType;
// import org.springframework.mock.web.MockMultipartFile;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.multipart.MultipartFile;
//
// import com.campforest.backend.board.controller.BoardController;
// import com.campforest.backend.board.dto.*;
// import com.campforest.backend.common.ApiResponse;
// import com.campforest.backend.common.ErrorCode;
// import com.campforest.backend.config.s3.S3Service;
// import com.campforest.backend.user.model.Users;
// import com.campforest.backend.user.service.UserService;
//
// import java.io.IOException;
// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;
//
// class BoardServiceTest {
//
//     @InjectMocks
//     private BoardController boardController;
//
//     @Mock
//     private BoardService boardService;
//
//     @Mock
//     private S3Service s3Service;
//
//     @Mock
//     private UserService userService;
//
//     @Mock
//     private Authentication authentication;
//
//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//         when(authentication.getName()).thenReturn("test@example.com");
//         Users testUser = Users.builder()
//                 .userId(1L)
//                 .userName("name")
//                 .email("test@example.com")
//                 .password("password")
//                 .role(ROLE_USER)  // 적절한 역할을 지정해주세요
//                 .isOpen(true)  // 또는 false, 상황에 맞게 설정
//                 .nickname("testNickname")
//                 .build();
//
//         when(userService.findByEmail(anyString())).thenReturn(Optional.of(testUser));
//     }
//
//     // Utility methods for creating dummy data
//     private BoardRequestDto createDummyBoardRequestDto() {
//         BoardRequestDto dto = new BoardRequestDto();
//         dto.setUserId(1L);
//         dto.setTitle("Test Title");
//         dto.setContent("Test Content");
//         dto.setCategory("Test Category");
//         dto.setBoardOpen(true);
//         dto.setImageUrls(Arrays.asList("url1", "url2"));
//         return dto;
//     }
//
//     private BoardResponseDto createDummyBoardResponseDto() {
//         BoardResponseDto dto = new BoardResponseDto();
//         dto.setBoardId(1L);
//         dto.setUserId(1L);
//         dto.setTitle("Test Title");
//         dto.setContent("Test Content");
//         dto.setCategory("Test Category");
//         dto.setLikeCount(0L);
//         dto.setBoardOpen(true);
//         dto.setCreatedAt(LocalDateTime.now());
//         dto.setModifiedAt(LocalDateTime.now());
//         dto.setImageUrls(Arrays.asList("url1", "url2"));
//         return dto;
//     }
//
//     private CommentRequestDto createDummyCommentRequestDto() {
//         CommentRequestDto dto = new CommentRequestDto();
//         dto.setCommentWriterId(1L);
//         dto.setBoardId(1L);
//         dto.setContent("Test Comment");
//         return dto;
//     }
//
//     private CommentResponseDto createDummyCommentResponseDto() {
//         CommentResponseDto dto = new CommentResponseDto();
//         dto.setCommentId(1L);
//         dto.setCommentWriterId(1L);
//         dto.setBoardId(1L);
//         dto.setContent("Test Comment");
//         dto.setCreatedAt(LocalDateTime.now());
//         return dto;
//     }
//
//     @Test
//     void testWriteBoard() throws Exception {
//         BoardRequestDto requestDto = createDummyBoardRequestDto();
//         MockMultipartFile file = new MockMultipartFile("files", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes());
//
//         when(s3Service.upload(anyString(), any(MultipartFile.class), anyString())).thenReturn("https://s3-url.com/test.jpg");
//
//         ApiResponse<?> response = boardController.writeBoard(authentication, new MultipartFile[]{file}, requestDto);
//
//         assertEquals("게시물 작성에 성공하였습니다.", response.getMessage());
//         verify(boardService, times(1)).writeBoard(any(BoardRequestDto.class));
//     }
//
//     @Test
//     void testGetBoard() {
//         Long boardId = 1L;
//         BoardResponseDto responseDto = createDummyBoardResponseDto();
//
//         when(boardService.getBoard(boardId)).thenReturn(responseDto);
//
//         ApiResponse<?> response = boardController.getBoard(boardId);
//
//         assertEquals("게시글 단일 조회 성공", response.getMessage());
//         assertEquals(responseDto, response.getData());
//     }
//
//     @Test
//     void testGetAllBoard() {
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getAllBoards(anyLong(), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getAllBoard(authentication, page, size);
//
//         assertEquals("게시글 목록 조회 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testGetUserBoard() {
//         Long userId = 1L;
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getUserBoards(anyLong(), eq(userId), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getUserBoard(authentication, userId, page, size);
//
//         assertEquals("게시글 사용자별 조회에 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testGetTitleBoard() {
//         String title = "Test Title";
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getTitleBoards(anyLong(), eq(title), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getTitleBoard(authentication, title, page, size);
//
//         assertEquals("게시글 제목으로 검색에 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testGetCategoryBoard() {
//         String category = "Test Category";
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getCategoryBoards(anyLong(), eq(category), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getCategoryBoard(authentication, category, page, size);
//
//         assertEquals("게시글 카테고리별 조회에 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testGetSavedBoard() {
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getSavedBoards(anyLong(), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getSavedBoard(authentication, page, size);
//
//         assertEquals("저장한 게시 조회에 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testModifyBoard() throws IOException {
//         Long boardId = 1L;
//         BoardRequestDto requestDto = createDummyBoardRequestDto();
//         MockMultipartFile file = new MockMultipartFile("files", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes());
//
//         when(s3Service.upload(anyString(), any(MultipartFile.class), anyString())).thenReturn("https://s3-url.com/test.jpg");
//
//         ApiResponse<?> response = boardController.modifyBoard(authentication, boardId, new MultipartFile[]{file}, requestDto);
//
//         assertEquals("게시물 수정에 성공하였습니다.", response.getMessage());
//         verify(boardService, times(1)).modifyBoard(eq(boardId), any(BoardRequestDto.class));
//     }
//
//     @Test
//     void testDeleteBoard() {
//         Long boardId = 1L;
//         when(boardService.getBoard(boardId)).thenReturn(createDummyBoardResponseDto());
//
//         ApiResponse<?> response = boardController.deleteBoard(authentication, boardId);
//
//         assertEquals("게시글 삭제 성공하였습니다", response.getMessage());
//         verify(boardService, times(1)).deleteBoard(boardId);
//     }
//
//     @Test
//     void testLikeBoard() {
//         Long boardId = 1L;
//         when(boardService.checkLike(eq(boardId), anyLong())).thenReturn(false);
//         when(boardService.getBoard(boardId)).thenReturn(createDummyBoardResponseDto());
//
//         ApiResponse<?> response = boardController.likeBoard(authentication, boardId);
//
//         assertEquals("게시글 좋아요 성공하였습니다", response.getMessage());
//         verify(boardService, times(1)).likeBoard(eq(boardId), anyLong());
//     }
//
//     @Test
//     void testDeleteLike() {
//         Long boardId = 1L;
//         when(boardService.checkLike(eq(boardId), anyLong())).thenReturn(true);
//         when(boardService.getBoard(boardId)).thenReturn(createDummyBoardResponseDto());
//
//         ApiResponse<?> response = boardController.deleteLike(authentication, boardId);
//
//         assertEquals("게시글 좋아요 삭제 성공하였습니다", response.getMessage());
//         verify(boardService, times(1)).deleteLike(eq(boardId), anyLong());
//     }
//
//     @Test
//     void testCountBoardLike() {
//         Long boardId = 1L;
//         Long likeCount = 10L;
//
//         when(boardService.countBoardLike(boardId)).thenReturn(likeCount);
//
//         ApiResponse<?> response = boardController.countBoardLike(boardId);
//
//         assertEquals("좋아요 개수 조회 성공하였습니다", response.getMessage());
//         assertEquals(likeCount, response.getData());
//     }
//
//     @Test
//     void testSaveBoard() {
//         Long boardId = 1L;
//         when(boardService.checkSave(eq(boardId), anyLong())).thenReturn(false);
//
//         ApiResponse<?> response = boardController.saveBoard(authentication, boardId);
//
//         assertEquals("게시글 저장 성공하였습니다", response.getMessage());
//         verify(boardService, times(1)).saveBoard(eq(boardId), anyLong());
//     }
//
//     @Test
//     void testDeleteSave() {
//         Long boardId = 1L;
//
//         ApiResponse<?> response = boardController.deleteSave(authentication, boardId);
//
//         assertEquals("저장 삭제 성공하였습니다", response.getMessage());
//         verify(boardService, times(1)).deleteSave(eq(boardId), anyLong());
//     }
//
//     @Test
//     void testWriteComment() {
//         Long boardId = 1L;
//         CommentRequestDto requestDto = createDummyCommentRequestDto();
//
//         ApiResponse<?> response = boardController.writeComment(authentication, boardId, requestDto);
//
//         assertEquals("댓글 작성 성공", response.getMessage());
//         verify(boardService, times(1)).writeComment(eq(boardId), any(CommentRequestDto.class));
//     }
//
//     @Test
//     void testGetComment() {
//         Long boardId = 1L;
//         int page = 0;
//         int size = 10;
//         List<CommentResponseDto> commentList = Arrays.asList(createDummyCommentResponseDto(), createDummyCommentResponseDto());
//         Page<CommentResponseDto> commentPage = new PageImpl<>(commentList);
//
//         when(boardService.getComments(anyLong(), eq(boardId), eq(page), eq(size))).thenReturn(commentPage);
//
//         ApiResponse<?> response = boardController.getComment(authentication, boardId, page, size);
//
//         assertEquals("댓글 게시글별 조회에 성공하였습니다", response.getMessage());
//         assertEquals(commentPage, response.getData());
//     }
//
//     @Test
//     void testGetUserComment() {
//         Long commentWriterId = 1L;
//         List<CommentResponseDto> commentList = Arrays.asList(createDummyCommentResponseDto(), createDummyCommentResponseDto());
//
//         when(boardService.getUserComment(commentWriterId)).thenReturn(commentList);
//
//         ApiResponse<?> response = boardController.getUserComment(commentWriterId);
//
//         assertEquals("댓글 유저별 조회에 성공하였습니다", response.getMessage());
//         assertEquals(commentList, response.getData());
//     }
//
// //    @Test
// //    void testDeleteComment() {
// //        Long commentId = 1L;
// //        ApiResponse<?> response = boardController.deleteComment(authentication, commentId);
// //
// //        assertEquals("댓글 삭제 성공하였습니다", response.getMessage());
// //        verify(boardService, times(1)).deleteComment(commentId);
// //    }
//
//     @Test
//     void testCountBoardComment() {
//         Long boardId = 1L;
//         Long commentCount = 5L;
//
//         when(boardService.countBoardComment(boardId)).thenReturn(commentCount);
//
//         ApiResponse<?> response = boardController.countBoardComment(boardId);
//
//         assertEquals("댓글 개수 조회 성공하였습니다", response.getMessage());
//         assertEquals(commentCount, response.getData());
//     }
//
//     @Test
//     void testLikeComment() {
//         Long commentId = 1L;
//         when(boardService.checkCommentLike(eq(commentId), anyLong())).thenReturn(false);
//         when(boardService.countCommentLike(commentId)).thenReturn(1L);
//
//         ApiResponse<?> response = boardController.likeComment(authentication, commentId);
//
//         assertEquals("댓글 좋아요 성공하였습니다", response.getMessage());
//         verify(boardService, times(1)).likeComment(eq(commentId), anyLong());
//     }
//
//     @Test
//     void testDeleteCommentLike() {
//         Long commentId = 1L;
//         when(boardService.countCommentLike(commentId)).thenReturn(0L);
//
//         ApiResponse<?> response = boardController.deleteCommentLike(authentication, commentId);
//
//         assertEquals("댓글 좋아요 삭제 성공하였습니다", response.getMessage());
//         assertEquals(0L, response.getData());
//         verify(boardService, times(1)).deleteCommentLike(eq(commentId), anyLong());
//     }
//
//     @Test
//     void testCountCommentLike() {
//         Long commentId = 1L;
//         Long likeCount = 3L;
//
//         when(boardService.countCommentLike(commentId)).thenReturn(likeCount);
//
//         ApiResponse<?> response = boardController.countCommentLike(commentId);
//
//         assertEquals("댓글 좋아요 수 조회 성공", response.getMessage());
//         assertEquals(likeCount, response.getData());
//     }
//
//     @Test
//     void testGetAllBoardWithoutAuthentication() {
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getAllBoards(eq(-1L), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getAllBoard(null, page, size);
//
//         assertEquals("비로그인 게시글 목록 조회 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testGetUserBoardWithoutAuthentication() {
//         Long userId = 1L;
//         int page = 0;
//         int size = 10;
//         List<BoardResponseDto> boardList = Arrays.asList(createDummyBoardResponseDto(), createDummyBoardResponseDto());
//         Page<BoardResponseDto> boardPage = new PageImpl<>(boardList);
//
//         when(boardService.getUserBoards(eq(-1L), eq(userId), eq(page), eq(size))).thenReturn(boardPage);
//
//         ApiResponse<?> response = boardController.getUserBoard(null, userId, page, size);
//
//         assertEquals("비로그인 게시글 사용자별 조회 성공하였습니다", response.getMessage());
//         assertEquals(boardPage, response.getData());
//     }
//
//     @Test
//     void testGetCommentWithoutAuthentication() {
//         Long boardId = 1L;
//         int page = 0;
//         int size = 10;
//         List<CommentResponseDto> commentList = Arrays.asList(createDummyCommentResponseDto(), createDummyCommentResponseDto());
//         Page<CommentResponseDto> commentPage = new PageImpl<>(commentList);
//
//         when(boardService.getComments(eq(-1L), eq(boardId), eq(page), eq(size))).thenReturn(commentPage);
//
//         ApiResponse<?> response = boardController.getComment(null, boardId, page, size);
//
//         assertEquals("비로그인 댓글 게시글별 조회 성공하였습니다", response.getMessage());
//         assertEquals(commentPage, response.getData());
//     }
//
// }
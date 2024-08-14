package com.campforest.backend.board.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.campforest.backend.board.dto.BoardImageDto;
import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.dto.SearchResult;
import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.repository.comment.CommentRepository;
import com.campforest.backend.board.service.BoardService;
import com.campforest.backend.board.service.CommentService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.CursorResult;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;
    private final S3Service s3Service;
    private final UserService userService;
    private final NotificationService notificationService;
    private final CommentService commentService;

    //게시글 작성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> writeBoard(
            Authentication authentication,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "boardRequestDto") BoardRequestDto boardRequestDto
    ) {
        try {
            Users users = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            List<String> imageUrls = new ArrayList<>();
            if (files != null) {
                for (MultipartFile file : files) {
                    String extension = file.getOriginalFilename()
                            .substring(file.getOriginalFilename().lastIndexOf("."));
                    String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
                    imageUrls.add(fileUrl);
                }
            }
            boardRequestDto.setImageUrls(imageUrls);
            boardRequestDto.setUserId(users.getUserId());
            boardService.writeBoard(boardRequestDto);
            return ApiResponse.createSuccessWithNoContent("게시물 작성에 성공하였습니다.");
        } catch (IOException e) {
            return ApiResponse.createError(ErrorCode.FILE_UPLOAD_FAILED);
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_CREATION_FAILED);
        }
    }

    //게시글 단일 조회
    @GetMapping("/public/detail")
    public ApiResponse<?> getBoard(
        Authentication authentication,
        @RequestParam Long boardId) {
        try {
            if (authentication == null) {
                BoardResponseDto board = boardService.getBoard(-1L,boardId);
                return ApiResponse.createSuccess(board, "비로그인 게시글 단일 조회 성공");
            }
            else {
                Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

                Long nowId = user.getUserId();
                BoardResponseDto board = boardService.getBoard(nowId, boardId);
                return ApiResponse.createSuccess(board, "게시글 단일 조회 성공");
            }
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
        }
    }

    //전체 게시글 조회
    @GetMapping("/public")
    public ApiResponse<?> getAllBoard(
            Authentication authentication,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            if (size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            }
            Long nowId=-1L;
            if (authentication != null) {
                Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                 nowId = user.getUserId();
            }
            CursorResult<BoardResponseDto> result = boardService.getAllBoards(nowId,cursorId,size);
            String message = authentication == null ? "비로그인 게시글 목록 조회 성공하였습니다" : "게시글 목록 조회 성공하였습니다";

            return ApiResponse.createSuccess(result, message);
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    //팔로잉하고있는 유저 게시글만
    @GetMapping("/following")
    public ApiResponse<?> getFollowingBoard(
        Authentication authentication,
        @RequestParam(required = false) Long cursorId,
        @RequestParam(defaultValue = "10") int size
    ) {
        try {
            if (size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            }
            Long nowId=-1L;
            if (authentication != null) {
                Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                nowId = user.getUserId();
            }
            CursorResult<BoardResponseDto> result = boardService.getFollowingBoards(nowId,cursorId,size);
            String message = authentication == null ? "비로그인 게시글 목록 조회 성공하였습니다" : "팔로잉 게시글 목록 조회 성공하였습니다";

            return ApiResponse.createSuccess(result, message);
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }


    //사용자별 게시글 조회
    @GetMapping("/public/user")
    public ApiResponse<?> getUserBoard(
            Authentication authentication,
            @RequestParam Long userId,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "10") int size
    ) {

        try {
            if (size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            }
            Long nowId=-1L;
            if (authentication != null) {
                Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                 nowId = user.getUserId();
               }
            SearchResult<BoardResponseDto> result = boardService.getUserBoards(nowId,userId,cursorId,size);
            String message = authentication == null ? "비로그인 사용자별 게시글 목록 조회 성공하였습니다" : "사용자별 게시글 목록 조회 성공하였습니다";

                return ApiResponse.createSuccess(result, message);
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

    //제목+내용 검색
    @GetMapping("/public/keyword")
    public ApiResponse<?> getKeywordBoard(
            Authentication authentication,
            @RequestParam String keyword,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "10") int size) {
        try {
            if (size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            }
            Long nowId=-1L;
            if (authentication != null) {
                Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                nowId = user.getUserId();
            }

            SearchResult<BoardResponseDto> boardResponseDtos = boardService.getKeywordBoards(-1L, keyword, cursorId, size);
            String message = authentication ==null  ? "비로그인 키워드별 게시글 목록 조회 성공하였습니다" : "키워드별 게시글 목록 조회 성공하였습니다";
            return ApiResponse.createSuccess(boardResponseDtos, message);

        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INVALID_BOARD_CATEGORY);
        }
    }

    //카테고리별 게시글 조회
    @GetMapping("/public/category")
    public ApiResponse<?> getCategoryBoard(
            Authentication authentication,
            @RequestParam String category,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "10") int size) {
        try {
            if (size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            }
            Long nowId=-1L;
            if (authentication != null) {
                Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                nowId = user.getUserId();
            }

            SearchResult<BoardResponseDto> boardResponseDtos = boardService.getCategoryBoards(-1L, category, cursorId, size);
            String message = authentication ==null  ? "비로그인 카테고리별 게시글 목록 조회 성공하였습니다" : "카테고리별 게시글 목록 조회 성공하였습니다";
            return ApiResponse.createSuccess(boardResponseDtos, message);

        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INVALID_BOARD_CATEGORY);
        }
    }

    //저장 목록 불러오기
    @GetMapping("/saved")
    public ApiResponse<?> getSavedBoard(
            Authentication authentication,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "10") int size) {
        try {
            if (size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            }
            if (authentication == null) {
                return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
            } else {
                Users user = userService.findByEmail(authentication.getName())
                        .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                ;
                Long nowId = user.getUserId();
                SearchResult<BoardResponseDto> boardResponseDtos = boardService.getSavedBoards(nowId, cursorId, size);
                return ApiResponse.createSuccess(boardResponseDtos, "저장한 게시 조회에 성공하였습니다");
            }
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INVALID_BOARD_CATEGORY);
        }
    }

    //게시글 이미지 저장
    @PostMapping("/modifyImage")
    public List<String> modifyImage(
        @RequestPart(value = "files", required = false) MultipartFile[] files
    ){
        try {
            List<String> imageUrls = new ArrayList<>();
            if (files != null) {
                for (MultipartFile file : files) {
                    String extension = file.getOriginalFilename()
                        .substring(file.getOriginalFilename().lastIndexOf("."));
                    String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
                    imageUrls.add(fileUrl);
                }
            }
            return imageUrls;
        }
        catch (Exception e) {
            return null;
        }
    }
    //게시물 수정
    @PutMapping
    public ApiResponse<?> modifyBoard(
            Authentication authentication,
            @RequestParam Long boardId,
            @RequestPart(value = "boardRequestDto") BoardRequestDto boardRequestDto) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
            if (!boardRequestDto.getUserId().equals(user.getUserId())) {
                return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
            }
            boardRequestDto.setUserId(user.getUserId());
            boardService.modifyBoard(boardId, boardRequestDto);
            return ApiResponse.createSuccessWithNoContent("게시물 수정에 성공하였습니다.");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_UPDATE_FAILED);
        }
    }

    //게시글 삭제
    @DeleteMapping
    public ApiResponse<?> deleteBoard(Authentication authentication, @RequestParam Long boardId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
            Long nowId = user.getUserId();
            if (!boardService.getBoard(nowId,boardId).getUserId().equals(nowId)) {
                return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
            }

            boardService.deleteBoard(boardId);
            return ApiResponse.createSuccessWithNoContent("게시글 삭제 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_DELETE_FAILED);
        }
    }

    //게시글 좋아요
    @PostMapping("/like")
    public ApiResponse<?> likeBoard(Authentication authentication, @RequestParam Long boardId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
            Long userId = user.getUserId();
            if (boardService.checkLike(boardId, userId)) {
                return ApiResponse.createError(ErrorCode.LIKE_ALREADY_EXISTS);
            }
            boardService.likeBoard(boardId, userId);

            BoardResponseDto board = boardService.getBoard(userId, boardId);

            Users receiver = userService.findByUserId(board.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 조회 실패"));

            notificationService.createNotification(receiver, user, NotificationType.LIKE, "님이 게시물에 좋아요를 눌렀습니다.");

            return ApiResponse.createSuccess(board.getLikeCount(), "게시글 좋아요 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    //게시글 좋아요 삭제
    @DeleteMapping("/like")
    public ApiResponse<?> deleteLike(Authentication authentication, @RequestParam Long boardId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();
            if (!boardService.checkLike(boardId, userId)) {
                return ApiResponse.createError(ErrorCode.LIKE_NOT_FOUND);
            }
            boardService.deleteLike(boardId, userId);
            return ApiResponse.createSuccess(boardService.getBoard(userId, boardId).getLikeCount(), "게시글 좋아요 삭제 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
        }

    }

    //게시글별 좋아요 갯수 조회
    @GetMapping("/public/like/count")
    public ApiResponse<?> countBoardLike(@RequestParam Long boardId) {
        try {
            Long count = boardService.countBoardLike(boardId);
            return ApiResponse.createSuccess(count, "좋아요 개수 조회 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
        }
    }

    //게시글 저장
    @PostMapping("/save")
    public ApiResponse<?> saveBoard(Authentication authentication, @RequestParam Long boardId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();
            if (boardService.checkSave(boardId, userId)) {
                return ApiResponse.createError(ErrorCode.SAVE_ALREADY_EXISTS);
            }
            boardService.saveBoard(boardId, userId);
            return ApiResponse.createSuccessWithNoContent("게시글 저장 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/save")
    public ApiResponse<?> deleteSave(Authentication authentication, @RequestParam Long boardId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();
            boardService.deleteSave(boardId, userId);
            return ApiResponse.createSuccessWithNoContent("저장 삭제 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.SAVE_NOT_FOUND);
        }
    }

    //게시글에 댓글 작성
    @PostMapping("/comment")
    public ApiResponse<?> writeComment(
            Authentication authentication,
            @RequestBody CommentRequestDto commentRequestDto) {
        try {
            Users users = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            commentRequestDto.setCommentWriterId(users.getUserId());
            boardService.writeComment(commentRequestDto.getBoardId(), commentRequestDto);

            Boards board = boardService.findByBoardId(commentRequestDto.getBoardId());
            Users receiver = userService.findByUserId(board.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("유저 정보 조회 실패"));

            notificationService.createNotification(receiver, users, NotificationType.COMMENT, "님이 댓글을 남겼습니다.");

            return ApiResponse.createSuccessWithNoContent("댓글 작성 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.COMMENT_CREATION_FAILED);
        }
    }

    //게시글에 달려있는 댓글 목록 조회
    @GetMapping("/public/comment")
    public ApiResponse<?> getComment(
            Authentication authentication,
            @RequestParam Long boardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            if (page < 0 || size <= 0) {
                return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
            } else if (authentication == null) {
                Page<CommentResponseDto> commentResponseDtos = boardService.getComments(-1L, boardId, page, size);
                return ApiResponse.createSuccess(commentResponseDtos, "비로그인 댓글 게시글별 조회 성공하였습니다");
            } else {
                Users user = userService.findByEmail(authentication.getName())
                        .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
                ;
                Long nowId = user.getUserId();
                Page<CommentResponseDto> commentResponseDtos = boardService.getComments(nowId, boardId, page, size);
                return ApiResponse.createSuccess(commentResponseDtos, "댓글 게시글별 조회에 성공하였습니다");
            }
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
        }
    }

    //유저가 단 댓글 목록 조회
    @GetMapping("/comment/user")
    public ApiResponse<?> getUserComment(@RequestParam Long commentWriterId) {
        try {
            List<CommentResponseDto> commentResponseDtos = boardService.getUserComment(commentWriterId);
            return ApiResponse.createSuccess(commentResponseDtos, "댓글 유저별 조회에 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

    //댓글 삭제
    @DeleteMapping("/comment")
    public ApiResponse<?> deleteComment(
            Authentication authentication,
            @RequestParam Long commentId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
            if (!boardService.getCommentById(commentId).getCommentWriterId().equals(user.getUserId())) {
                return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
            }
            boardService.deleteComment(commentId);
            return ApiResponse.createSuccessWithNoContent("댓글 삭제 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.COMMENT_NOT_FOUND);
        }
    }

    //게시글별 댓글 갯수 조회
    @GetMapping("/public/comment/count")
    public ApiResponse<?> countBoardComment(@RequestParam Long boardId) {
        try {
            Long count = boardService.countBoardComment(boardId);
            return ApiResponse.createSuccess(count, "댓글 개수 조회 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
        }
    }

    //댓글 좋아요
    @PostMapping("/commentlike")
    public ApiResponse<?> likeComment(Authentication authentication, @RequestParam Long commentId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();
            if (boardService.checkCommentLike(commentId, userId)) {
                return ApiResponse.createError(ErrorCode.COMMENT_LIKE_ALREADY_EXISTS);
            } else {
                boardService.likeComment(commentId, userId);

                Comment comment = commentService.findById(commentId);

                Users receiver = userService.findByUserId(comment.getCommentWriterId())
                        .orElseThrow(()-> new IllegalArgumentException("사용자 조회 실패"));

                notificationService.createNotification(receiver, user, NotificationType.COMMENT, "님이 댓글에 좋아요를 눌렀습니다.");

                return ApiResponse.createSuccess(boardService.countCommentLike(commentId), "댓글 좋아요 성공하였습니다");
            }
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);

        }
    }

    //댓글 좋아요 삭제
    @DeleteMapping("/commentlike")
    public ApiResponse<?> deleteCommentLike(Authentication authentication, @RequestParam Long commentId) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();

            boardService.deleteCommentLike(commentId, userId);
            return ApiResponse.createSuccess(boardService.countCommentLike(commentId), "댓글 좋아요 삭제 성공하였습니다");

        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.COMMENT_LIKE_NOT_FOUND);
        }
    }

    @GetMapping("/public/commentlike/count")
    public ApiResponse<?> countCommentLike(@RequestParam Long commentId) {
        try {
            Long count = boardService.countCommentLike(commentId);
            return ApiResponse.createSuccess(count, "댓글 좋아요 수 조회 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.COMMENT_NOT_FOUND);
        }
    }
    @GetMapping("/public/count")
    public ApiResponse<?> countAll(Authentication authentication) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();
            return ApiResponse.createSuccess(boardService.countAll(userId), "사용자 콘텐츠 작성 수 조회 성공");

        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

}

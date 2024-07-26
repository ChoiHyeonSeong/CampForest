package com.campforest.backend.board.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
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

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.service.BoardService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.product.dto.ProductRegistDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

	private final BoardService boardService;
	private final S3Service s3Service;

	//게시글 작성
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<?> writeBoard(
		@RequestPart(value = "files", required = false) MultipartFile[] files,
		@RequestPart(value = "boardRequestDto") BoardRequestDto boardRequestDto
	) {
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
			boardRequestDto.setImageUrls(imageUrls);
			boardService.writeBoard(boardRequestDto);
			return ApiResponse.createSuccessWithNoContent("게시물 작성에 성공하였습니다.");
		} catch (IOException e) {
			return ApiResponse.createError(ErrorCode.FILE_UPLOAD_FAILED);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.BOARD_CREATION_FAILED);
		}
	}

	//게시글 단일 조회
	@GetMapping("/detail")
	public ApiResponse<?> getBoard(@RequestParam Long boardId) {
		try {
			BoardResponseDto board = boardService.getBoard(boardId);
			return ApiResponse.createSuccess(board, "게시글 단일 조회 성공");
		} catch (Exception e) {
			log.error("Board not found", e);
			return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
		}
	}

	//전체 게시글 조회
	@GetMapping
	public ApiResponse<?> getAllBoard(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		try {
			if (page < 0 || size <= 0) {
				return ApiResponse.createError(ErrorCode.INVALID_PAGE_NUMBER);
			}
			Page<BoardResponseDto> boardResponseDtos = boardService.getAllBoards(page, size);
			return ApiResponse.createSuccess(boardResponseDtos, "게시글 목록 조회 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	//사용자별 게시글 조회
	@GetMapping("/user")
	public ApiResponse<?> getUserBoard(@RequestParam Long userId) {
		try {
			List<BoardResponseDto> boardResponseDtoList = boardService.getUserBoards(userId);
			return ApiResponse.createSuccess(boardResponseDtoList, "게시글 사용자별 조회에 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to retrieve user boards", e);
			return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
		}
	}

	//카테고리별 게시글 조회
	@GetMapping("/category")
	public ApiResponse<?> getCategoryBoard(@RequestParam String category) {
		try {
			List<BoardResponseDto> boardResponseDtoList = boardService.getCategoryBoards(category);
			return ApiResponse.createSuccess(boardResponseDtoList, "게시글 카테고리별 조회에 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to retrieve category boards", e);
			return ApiResponse.createError(ErrorCode.INVALID_BOARD_CATEGORY);
		}
	}

	//게시물 수정
	@PutMapping
	public ApiResponse<?> modifyBoard(@RequestParam Long boardId, @RequestBody BoardRequestDto boardRequestDto) {
		try {
			boardService.modifyBoard(boardId, boardRequestDto);
			return ApiResponse.createSuccessWithNoContent("게시물 수정에 성공하였습니다.");
		} catch (Exception e) {
			log.error("Board update failed", e);
			return ApiResponse.createError(ErrorCode.BOARD_UPDATE_FAILED);
		}
	}

	//게시글 삭제
	@DeleteMapping
	public ApiResponse<?> deleteBoard(@RequestParam Long boardId) {
		try {
			boardService.deleteBoard(boardId);
			return ApiResponse.createSuccessWithNoContent("게시글 삭제 성공하였습니다");
		} catch (Exception e) {
			log.error("Board deletion failed", e);
			return ApiResponse.createError(ErrorCode.BOARD_DELETE_FAILED);
		}
	}

	//게시글 좋아요
	@PostMapping("/like")
	public ApiResponse<?> likeBoard(@RequestParam Long boardId, @RequestParam Long userId) {
		try {
			if (boardService.checkLike(boardId, userId)) {
				return ApiResponse.createError(ErrorCode.LIKE_ALREADY_EXISTS);
			}
			boardService.likeBoard(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 좋아요 성공하였습니다");
		} catch (Exception e) {
			log.error("Like operation failed", e);
			return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	//게시글 좋아요 삭제
	@DeleteMapping("like")
	public ApiResponse<?> deleteLike(@RequestParam Long boardId, @RequestParam Long userId) {
		try {
			boardService.deleteLike(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 좋아요 삭제 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to delete like", e);
			return ApiResponse.createError(ErrorCode.LIKE_NOT_FOUND);
		}
	}

	//게시글별 좋아요 갯수 조회
	@GetMapping("/like/count")
	public ApiResponse<?> countBoardLike(@RequestParam Long boardId) {
		try {
			Long count = boardService.countBoardLike(boardId);
			return ApiResponse.createSuccess(count, "좋아요 개수 조회 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to count board likes", e);
			return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
		}
	}

	//게시글 저장
	@PostMapping("/save")
	public ApiResponse<?> saveBoard(@RequestParam Long boardId, @RequestParam Long userId) {
		try {
			if (boardService.checkSave(boardId, userId)) {
				return ApiResponse.createError(ErrorCode.SAVE_ALREADY_EXISTS);
			}
			boardService.saveBoard(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 저장 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to save board", e);
			return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/save")
	public ApiResponse<?> deleteSave(@RequestParam Long boardId, @RequestParam Long userId) {
		try {
			boardService.deleteSave(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("저장 삭제 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to delete save", e);
			return ApiResponse.createError(ErrorCode.SAVE_NOT_FOUND);
		}
	}

	//게시글에 댓글 작성
	@PostMapping("/comment")
	public ApiResponse<?> writeComment(@RequestParam Long boardId, @RequestBody CommentRequestDto commentRequestDto) {
		try {
			boardService.writeComment(boardId, commentRequestDto);
			return ApiResponse.createSuccessWithNoContent("댓글 작성 성공");
		} catch (Exception e) {
			log.error("Failed to write comment", e);
			return ApiResponse.createError(ErrorCode.COMMENT_CREATION_FAILED);
		}
	}

	//게시글에 달려있는 댓글 목록 조회
	@GetMapping("/comment")
	public ApiResponse<?> getComment(@RequestParam Long boardId) {
		try {
			List<CommentResponseDto> commentResponseDtos = boardService.getComment(boardId);
			return ApiResponse.createSuccess(commentResponseDtos, "댓글 게시글별 조회에 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to retrieve comments", e);
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
			log.error("Failed to retrieve user comments", e);
			return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
		}
	}

	//댓글 삭제
	@DeleteMapping("/comment")
	public ApiResponse<?> deleteComment(@RequestParam Long commentId) {
		try {
			boardService.deleteComment(commentId);
			return ApiResponse.createSuccessWithNoContent("댓글 삭제 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.COMMENT_NOT_FOUND);
		}
	}

	//게시글별 댓글 갯수 조회
	@GetMapping("/comment/count")
	public ApiResponse<?> countBoardComment(@RequestParam Long boardId) {
		try {
			Long count = boardService.countBoardComment(boardId);
			return ApiResponse.createSuccess(count, "댓글 개수 조회 성공하였습니다");
		} catch (Exception e) {
			log.error("Failed to count board comment", e);
			return ApiResponse.createError(ErrorCode.BOARD_NOT_FOUND);
		}
	}

	//댓글 좋아요
	@PostMapping("/commentlike")
	public ApiResponse<?> likeComment(@RequestParam Long commentId, @RequestParam Long userId) {
		try {
			if (boardService.checkCommentLike(commentId, userId)) {
				return ApiResponse.createError(ErrorCode.COMMENT_LIKE_ALREADY_EXISTS);
			} else {
				boardService.likeComment(commentId, userId);
				return ApiResponse.createSuccessWithNoContent("댓글 좋아요 성공하였습니다");
			}
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);

		}
	}

	//댓글 좋아요 삭제
	@DeleteMapping("/commentlike")
	public ApiResponse<?> deleteCommentLike(@RequestParam Long commentId, @RequestParam Long userId) {
		try {
			boardService.deleteCommentLike(commentId, userId);
			return ApiResponse.createSuccessWithNoContent("댓글 좋아요 삭제 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.COMMENT_LIKE_NOT_FOUND);
		}
	}

	@GetMapping("/commentlike/count")
	public ApiResponse<?> countCommentLike(@RequestParam Long commentId) {
		try {
			Long count = boardService.countCommentLike(commentId);
			return ApiResponse.createSuccess(count, "댓글 좋아요 수 조회 성공");
		} catch (Exception e) {
			log.error("Failed to count comment likes", e);
			return ApiResponse.createError(ErrorCode.COMMENT_NOT_FOUND);
		}
	}
}

package com.campforest.backend.board.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	)	throws IOException
	{
		List<String> imageUrls = new ArrayList<>();
		for (MultipartFile file : files) {
			String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
			String fileUrl = s3Service.upload(file.getOriginalFilename(),file,extension);
			imageUrls.add(fileUrl);
			log.info("Uploaded file URL: " + fileUrl);
		}
		boardRequestDto.setImageUrls(imageUrls);
		boardService.writeBoard(boardRequestDto);
		return ApiResponse.createSuccessWithNoContent("게시물 작성에 성공하였습니다.");
	}

	//게시글 상세 조회
	@GetMapping("/{boardId}")
	public ApiResponse<BoardResponseDto> getBoard(@PathVariable Long boardId) {
		BoardResponseDto board = boardService.getBoard(boardId);
		return ApiResponse.createSuccess(board, "게시글 단일 조회 성공");
	}

	//전체 게시글 조회
	@GetMapping
	public ApiResponse<List<BoardResponseDto>> getAllBoard() {
		List<BoardResponseDto> boardResponseDtoList = boardService.getAllBoards();
		return ApiResponse.createSuccess(boardResponseDtoList, "게시글 목록 조회 성공하였습니다");
	}

	//사용자별 게시글 조회
	@GetMapping("/user/{userId}")
	public ApiResponse<List<BoardResponseDto>> getUserBoard(@PathVariable Long userId) {
		List<BoardResponseDto> boardResponseDtoList = boardService.getUserBoards(userId);
		return ApiResponse.createSuccess(boardResponseDtoList, "게시글 사용자별 조회에 성공하였습니다");
	}

	//카테고리별 게시글 조회
	@GetMapping("/category")
	public ApiResponse<List<BoardResponseDto>> getCategoryBoard(@RequestParam String category) {
		List<BoardResponseDto> boardResponseDtoList = boardService.getCategoryBoards(category);
		return ApiResponse.createSuccess(boardResponseDtoList, "게시글 카테고리별 조회에 성공하였습니다");
	}

	//게시물 수정
	@PutMapping(("/{boardId}"))
	public ApiResponse<?> modifyBoard(@PathVariable Long boardId, @RequestBody BoardRequestDto boardRequestDto) {
		boardService.modifyBoard(boardId, boardRequestDto);
		System.out.println(boardRequestDto.toString());
		return ApiResponse.createSuccessWithNoContent("게시물 수정에 성공하였습니다.");
	}

	//게시글 삭제
	@DeleteMapping("/{boardId}")
	public ApiResponse<?> deleteBoard(@PathVariable Long boardId) {
		System.out.println(boardId);
		boardService.deleteBoard(boardId);
		return ApiResponse.createSuccessWithNoContent("게시글 삭제 성공하였습니다");
	}

	//게시글 좋아요, 이미 동일 boardId, userId존재하면 삭제
	@PostMapping("/like/{boardId}/{userId}")
	public ApiResponse<?> likeBoard(@PathVariable Long boardId, @PathVariable Long userId) {
		if (boardService.checkLike(boardId, userId)) {
			boardService.deleteLike(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 좋아요 삭제 성공하였습니다");
		} else {
			boardService.likeBoard(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 좋아요 성공하였습니다");

		}
	}

	//게시글별 좋아요 갯수 조회
	@GetMapping("/like/{boardId}/count")
	public ApiResponse<Long> countBoardLike(@PathVariable Long boardId) {
		Long count = boardService.countBoardLike(boardId);
		return ApiResponse.createSuccess(count, "좋아요 개수 조회 성공하였습니다");
	}

	//게시글 저장, 이미 동일 boardId, userId존재하면 삭제
	@PostMapping("/save/{boardId}/{userId}")
	public ApiResponse<?> saveBoard(@PathVariable Long boardId, @PathVariable Long userId) {
		if (boardService.checkSave(boardId, userId)) {
			boardService.deleteSave(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("저장 삭제 성공하였습니다");
		} else {
			boardService.saveBoard(boardId, userId);
			return ApiResponse.createSuccessWithNoContent("게시글 저장 성공하였습니다");
		}
	}

	//게시글에 댓글 작성
	@PostMapping("/comment/{boardId}")
	public ApiResponse<?> writeComment(@PathVariable Long boardId, @RequestBody CommentRequestDto commentRequestDto) {
		boardService.writeComment(boardId, commentRequestDto);
		return ApiResponse.createSuccessWithNoContent("댓글 작성 성공");
	}

	//게시글에 달려있는 댓글 목록 조회
	@GetMapping("/comment/{boardId}")
	public ApiResponse<List<CommentResponseDto>> getComment(@PathVariable Long boardId) {
		List<CommentResponseDto> commendResponseDtos = boardService.getComment(boardId);
		return ApiResponse.createSuccess(commendResponseDtos, "댓글 게시글별 조회에 성공하였습니다");
	}

	//유저가 단 댓글 목록 조회
	@GetMapping("/comment/user/{commentWriterId}")
	public ApiResponse<List<CommentResponseDto>> getUserComment(@PathVariable Long commentWriterId) {
		List<CommentResponseDto> commentResponseDtos = boardService.getUserComment(commentWriterId);
		return ApiResponse.createSuccess(commentResponseDtos, "댓글 유저별 조회에 성공하였습니다");
	}

	//댓글 삭제
	@DeleteMapping("/comment/{commentId}")
	public ApiResponse<?> deleteComment(@PathVariable Long commentId) {
		boardService.deleteComment(commentId);
		return ApiResponse.createSuccessWithNoContent("댓글 삭제 성공하였습니다");
	}

	//게시글별 댓글 갯수 조회
	@GetMapping("/comment/{boardId}/count")
	public ApiResponse<Long> countBoardComment(@PathVariable Long boardId) {
		Long count = boardService.countBoardComment(boardId);
		return ApiResponse.createSuccess(count, "댓글 개수 조회 성공하였습니다");
	}

	//댓글 좋아요 이미 동일 boardId, userId존재하면 삭제
	@PostMapping("/commentlike")
	public  ApiResponse<?> likeComment(@RequestParam Long commentId, @RequestParam Long userId ){
		if(boardService.checkCommentLike(commentId, userId)){
			boardService.deleteCommentLike(commentId, userId);
			return ApiResponse.createSuccessWithNoContent("댓글 좋아요 삭제 성공하였습니다");
		}
		else{
			boardService.likeComment(commentId, userId);
			return ApiResponse.createSuccessWithNoContent("댓글 좋아요 성공하였습니다");
		}
	}

	@GetMapping("/commentlike/{commentId}/count")
	public ApiResponse<Long> countCommentLike(@PathVariable Long commentId ){
		Long count = boardService.countCommentLike(commentId);
		return ApiResponse.createSuccess(count,"댓글 좋아요 수 조회 성공");
	}
}

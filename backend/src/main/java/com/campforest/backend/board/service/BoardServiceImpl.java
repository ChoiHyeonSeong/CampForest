package com.campforest.backend.board.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.campforest.backend.board.dto.BoardRequestDto;
import com.campforest.backend.board.dto.BoardResponseDto;
import com.campforest.backend.board.dto.CommentRequestDto;
import com.campforest.backend.board.dto.CommentResponseDto;
import com.campforest.backend.board.entity.BoardImage;
import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.entity.CommentLikes;
import com.campforest.backend.board.entity.Likes;
import com.campforest.backend.board.entity.Save;
import com.campforest.backend.board.repository.boardimage.BoardImageRepository;
import com.campforest.backend.board.repository.board.BoardRepository;
import com.campforest.backend.board.repository.commentlike.CommentLikeRepository;
import com.campforest.backend.board.repository.comment.CommentRepository;
import com.campforest.backend.board.repository.like.LikeRepository;
import com.campforest.backend.board.repository.save.SaveRepository;
import com.campforest.backend.user.model.UserImage;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BoardServiceImpl implements BoardService {
	private final BoardRepository boardRepository;
	private final LikeRepository likeRepository;
	private final SaveRepository saveRepository;
	private final CommentRepository commentRepository;
	private final CommentLikeRepository commentLikeRepository;
	private final BoardImageRepository boardImageRepository;
	private final UserRepository userRepository;

	public BoardServiceImpl(BoardRepository boardRepository, LikeRepository likeRepository,
		SaveRepository saveRepository, CommentRepository commentRepository,
		CommentLikeRepository commentLikeRepository, BoardImageRepository boardImageRepository,
		UserRepository userRepository) {
		this.boardRepository = boardRepository;
		this.likeRepository = likeRepository;
		this.saveRepository = saveRepository;
		this.commentRepository = commentRepository;
		this.commentLikeRepository = commentLikeRepository;
		this.boardImageRepository = boardImageRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	@Override
	public void writeBoard(BoardRequestDto boardRequestDto) {
		Boards boards = Boards.builder()
			.userId(boardRequestDto.getUserId())
			.title(boardRequestDto.getTitle())
			.content(boardRequestDto.getContent())
			.category(boardRequestDto.getCategory())
			.isBoardOpen(boardRequestDto.isBoardOpen())
			.build();
		Boards saveBoard = boardRepository.save(boards);

		List<BoardImage> boardImages = boardRequestDto.getImageUrls().stream()
			.map(imageUrl -> BoardImage.builder()
				.boards(saveBoard)
				.imageUrl(imageUrl)
				.build())
			.collect(Collectors.toList());
		boardImageRepository.saveAll(boardImages);
	}

	@Transactional
	@Override
	public BoardResponseDto getBoard(Long boardId) {
		Boards boards = boardRepository.findById(boardId).orElseThrow(() -> new RuntimeException("Board not found"));
		return convertToDto(boards);
	}

	@Transactional
	@Override
	public Page<BoardResponseDto> getAllBoards(Long nowId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Boards> boardsPage = boardRepository.findAll(pageable);

		List<Long> likeBoardsId = likeRepository.findBoardIdsByUserId(nowId);
		List<Long> saveBoardsId = saveRepository.findBoardIdsByUserId(nowId);
		return boardsPage.map(board -> {
			BoardResponseDto dto = convertToDto(board);
			Users user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found"));
			UserImage userImage = user.getUserImage();
			String imageUrl = userImage != null ? userImage.getImageUrl() : null;
			if (!(imageUrl == null)) {
				dto.setUserImage(user.getUserImage().getImageUrl());
			}
			dto.setNickname(user.getNickname());
			dto.setLiked(likeBoardsId.contains(board.getBoardId()));
			dto.setSaved(saveBoardsId.contains(board.getBoardId()));
			return dto;
		});
	}

	@Override
	public Page<BoardResponseDto> getUserBoards(Long nowId, Long userId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Boards> boardsPage = boardRepository.findByUserId(userId, pageable);
		List<Long> likeBoardsId = likeRepository.findBoardIdsByUserId(nowId);
		List<Long> saveBoardsId = saveRepository.findBoardIdsByUserId(nowId);

		return boardsPage.map(board -> {
			BoardResponseDto dto = convertToDto(board);
			Users user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found"));
			UserImage userImage = user.getUserImage();
			String imageUrl = userImage != null ? userImage.getImageUrl() : null;
			if (!(imageUrl == null)) {
				dto.setUserImage(user.getUserImage().getImageUrl());
			}
			dto.setNickname(user.getNickname());

			dto.setSaved(saveBoardsId.contains(board.getBoardId()));
			dto.setLiked(likeBoardsId.contains(board.getBoardId()));
			return dto;
		});
	}

	@Override
	public Page<BoardResponseDto> getCategoryBoards(Long nowId, String category, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Boards> boardsPage = boardRepository.findByCategory(category, pageable);
		List<Long> likeBoardsId = likeRepository.findBoardIdsByUserId(nowId);
		List<Long> saveBoardsId = saveRepository.findBoardIdsByUserId(nowId);
		return boardsPage.map(board -> {
			BoardResponseDto dto = convertToDto(board);
			Users user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found"));
			UserImage userImage = user.getUserImage();
			String imageUrl = userImage != null ? userImage.getImageUrl() : null;
			if (!(imageUrl == null)) {
				dto.setUserImage(user.getUserImage().getImageUrl());
			}
			dto.setNickname(user.getNickname());

			dto.setSaved(saveBoardsId.contains(board.getBoardId()));
			dto.setLiked(likeBoardsId.contains(board.getBoardId()));
			return dto;
		});
	}

	@Override
	public Page<BoardResponseDto> getTitleBoards(Long nowId, String title, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Boards> boardsPage = boardRepository.findByTitle(title, pageable);
		List<Long> likeBoardsId = likeRepository.findBoardIdsByUserId(nowId);
		List<Long> saveBoardsId = saveRepository.findBoardIdsByUserId(nowId);
		return boardsPage.map(board -> {
			BoardResponseDto dto = convertToDto(board);
			Users user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found"));
			UserImage userImage = user.getUserImage();
			String imageUrl = userImage != null ? userImage.getImageUrl() : null;
			if (!(imageUrl == null)) {
				dto.setUserImage(user.getUserImage().getImageUrl());
			}
			dto.setNickname(user.getNickname());

			dto.setSaved(saveBoardsId.contains(board.getBoardId()));
			dto.setLiked(likeBoardsId.contains(board.getBoardId()));
			return dto;
		});
	}

	@Transactional
	@Override
	public void modifyBoard(Long boardId, BoardRequestDto boardRequestDto) {
		// 1. 게시글 조회
		Boards board = boardRepository.findById(boardId)
			.orElseThrow(() -> new EntityNotFoundException("Board not found with id: " + boardId));

		// 2. 게시글 정보 업데이트 (Builder 패턴 사용)
		Boards updateBoard = board.toBuilder()
			.title(boardRequestDto.getTitle())
			.content(boardRequestDto.getContent())
			.category(boardRequestDto.getCategory())
			.isBoardOpen(boardRequestDto.isBoardOpen())
			.build();
		boardRepository.save(updateBoard);
		// 3. 기존 이미지 삭제
		boardImageRepository.deleteByBoardId(board);

		// 4. 새 이미지 추가
		List<BoardImage> boardImages = boardRequestDto.getImageUrls().stream()
			.map(imageUrl -> BoardImage.builder()
				.boards(updateBoard)
				.imageUrl(imageUrl)
				.build())
			.collect(Collectors.toList());
		boardImageRepository.saveAll(boardImages);

	}

	@Transactional
	@Override
	public void deleteBoard(Long boardId) {
		boardRepository.deleteById(boardId);
	}

	@Transactional
	@Override
	public void likeBoard(Long boardId, Long userId) {

		Likes likes = Likes.builder()
			.boardId(boardId)
			.userId(userId)
			.build();
		boardRepository.plusLikeCount(boardId);
		likeRepository.save(likes);

	}

	@Transactional
	@Override
	public void deleteLike(Long boardId, Long userId) {
		boardRepository.minusLikeCount(boardId);
		likeRepository.deleteByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public boolean checkLike(Long boardId, Long userId) {
		return likeRepository.existsByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public void saveBoard(Long boardId, Long userId) {
		Save save = Save.builder()
			.boardId(boardId)
			.userId(userId)
			.build();
		saveRepository.save(save);
	}

	@Transactional
	@Override
	public void deleteSave(Long boardId, Long userId) {
		saveRepository.deleteByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public boolean checkSave(Long boardId, Long userId) {
		return saveRepository.existsByBoardIdAndUserId(boardId, userId);
	}

	@Transactional
	@Override
	public void writeComment(Long boardId, CommentRequestDto commentRequestDto) {
		Comment comment = Comment.builder()
			.boardId(boardId)
			.commentWriterId(commentRequestDto.getCommentWriterId())
			.content(commentRequestDto.getContent())
			.build();

		boardRepository.plusCommentCount(boardId);
		commentRepository.save(comment);
	}

	@Transactional
	@Override
	public Page<CommentResponseDto> getComments(Long nowId, Long boardId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Comment> commentPage = commentRepository.findByBoardId(boardId, pageable);
		List<Long> likeBoardsId = commentLikeRepository.findCommentIdsByUserId(nowId);
		return commentPage.map(comment -> {
			CommentResponseDto dto = convertToCommentDto(comment);
			Users user = userRepository.findById(dto.getCommentWriterId())
				.orElseThrow(() -> new RuntimeException("User not found"));

			UserImage userImage = user.getUserImage();
			String imageUrl = userImage != null ? userImage.getImageUrl() : null;

			dto.setNickname(user.getNickname());
			if (imageUrl != null) {
				dto.setUserImage(imageUrl);
			}
			dto.setLiked(likeBoardsId.contains(comment.getCommentId()));
			return dto;
		});
	}

	@Transactional
	@Override
	public List<CommentResponseDto> getUserComment(Long commentWriterId) {
		List<Comment> commentList = commentRepository.findByCommentWriterId(commentWriterId);
		List<CommentResponseDto> commentResponseDtos = new ArrayList<>();
		for (Comment comment : commentList) {
			CommentResponseDto dto = convertToCommentDto(comment);
			commentResponseDtos.add(dto);
		}
		return commentResponseDtos;
	}

	@Transactional
	@Override
	public void deleteComment(Long commentId) {
		Long boardId = commentRepository.findByCommentId(commentId);
		boardRepository.minusLikeCount(boardId);
		commentRepository.deleteById(commentId);
	}

	@Transactional
	@Override
	public Long countBoardComment(Long boardId) {
		return commentRepository.countAllByBoardId(boardId);
	}

	@Transactional
	@Override
	public Long countBoardLike(Long boardId) {
		return likeRepository.countAllByBoardId(boardId);
	}

	@Transactional
	@Override
	public void likeComment(Long commentId, Long userId) {

		CommentLikes commentLikes = CommentLikes.builder()
			.commentId(commentId)
			.userId(userId)
			.build();
		commentRepository.plusLikeCount(commentId);
		commentLikeRepository.save(commentLikes);
	}

	@Transactional
	@Override
	public void deleteCommentLike(Long commentLike, Long userId) {
		boardRepository.minusCommentCount(commentLike);
		commentRepository.minusLikeCount(commentLike);
		commentLikeRepository.deleteByCommentIdAndUserId(commentLike, userId);
	}

	@Transactional
	@Override
	public boolean checkCommentLike(Long commentLike, Long userId) {
		return commentLikeRepository.existsByCommentIdAndUserId(commentLike, userId);
	}

	@Transactional
	@Override
	public Long countCommentLike(Long commentId) {
		return commentLikeRepository.countAllByCommentId(commentId);
	}

	@Override
	public Page<BoardResponseDto> getSavedBoards(Long nowId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Boards> savedBoardsPage = boardRepository.findSavedBoardsByUserId(nowId, pageable);
		List<Long> likeBoardsId = likeRepository.findBoardIdsByUserId(nowId);
		List<Long> saveBoardsId = saveRepository.findBoardIdsByUserId(nowId);

		return savedBoardsPage.map(board -> {
			BoardResponseDto dto = convertToDto(board);
			Users user = userRepository.findById(nowId)
				.orElseThrow(() -> new RuntimeException("User not found"));

			UserImage userImage = user.getUserImage();
			String imageUrl = userImage != null ? userImage.getImageUrl() : null;

			dto.setNickname(user.getNickname());
			if (imageUrl != null) {
				dto.setUserImage(imageUrl);
			}
			dto.setLiked(likeBoardsId.contains(board.getBoardId()));
			dto.setSaved(saveBoardsId.contains(board.getBoardId()));  // 저장된 게시글이므로 true로 설정

			return dto;
		});
	}

	@Override
	public Comment getCommentById(Long commentId) {
		return commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("Comment not found"));
	}

	private BoardResponseDto convertToDto(Boards boards) {
		BoardResponseDto dto = new BoardResponseDto();
		dto.setBoardId(boards.getBoardId());
		dto.setUserId(boards.getUserId());
		dto.setTitle(boards.getTitle());
		dto.setContent(boards.getContent());
		dto.setCategory(boards.getCategory());
		dto.setCommentCount(boards.getCommentCount());
		dto.setLikeCount(boards.getLikeCount());
		dto.setBoardOpen(boards.isBoardOpen());
		dto.setCreatedAt(boards.getCreatedAt());
		dto.setModifiedAt(boards.getModifiedAt());

		List<String> imageUrls = new ArrayList<>();
		for (BoardImage boardImage : boards.getBoardImages()) {
			imageUrls.add(boardImage.getImageUrl());
		}
		dto.setImageUrls(imageUrls);
		return dto;
	}

	private CommentResponseDto convertToCommentDto(Comment comment) {
		CommentResponseDto dto = new CommentResponseDto();
		dto.setBoardId(comment.getBoardId());
		dto.setCommentId(comment.getCommentId());
		dto.setLikeCount(comment.getLikeCount());
		dto.setCommentWriterId(comment.getCommentWriterId());
		dto.setContent(comment.getContent());
		dto.setCreatedAt(comment.getCreatedAt());
		return dto;
	}
}


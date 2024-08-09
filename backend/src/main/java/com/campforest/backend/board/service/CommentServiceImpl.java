package com.campforest.backend.board.service;

import org.springframework.stereotype.Service;

import com.campforest.backend.board.entity.Comment;
import com.campforest.backend.board.repository.comment.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService{

	private final CommentRepository commentRepository;

	@Override
	public Comment findById(Long id) {
		return commentRepository.findById(id).orElse(null);
	}
}

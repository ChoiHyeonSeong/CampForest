package com.campforest.backend.board.service;

import com.campforest.backend.board.entity.Comment;

public interface CommentService {

	Comment findById(Long id);
}

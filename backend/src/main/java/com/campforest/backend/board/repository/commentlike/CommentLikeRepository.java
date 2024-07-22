package com.campforest.backend.board.repository.commentlike;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.board.entity.CommentLikes;

public interface CommentLikeRepository extends JpaRepository<CommentLikes, Long>, CommentLikeRepositoryCustom {

}

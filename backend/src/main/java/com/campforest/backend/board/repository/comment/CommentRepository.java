package com.campforest.backend.board.repository.comment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>,CommentRepositoryCustom {


}

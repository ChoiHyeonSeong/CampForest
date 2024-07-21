package com.campforest.backend.board.repository.comment;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.Comment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepositoryCustom {

    List<Comment> findAllByBoardId( Long boardId);
    List<Comment> findByCommentWriterId(Long commentWriterId);
    Long countAllByBoardId(Long boardId);
}

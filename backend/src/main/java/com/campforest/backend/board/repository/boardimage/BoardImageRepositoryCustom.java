package com.campforest.backend.board.repository.boardimage;

import com.campforest.backend.board.entity.Boards;

public interface BoardImageRepositoryCustom {
    void deleteByBoardId(Boards board);
}

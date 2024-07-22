package com.campforest.backend.board.repository.boardimage;

import com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.QBoardImage;
import com.campforest.backend.board.entity.QBoards;
import com.querydsl.jpa.impl.JPAQueryFactory;

public class BoardImageRepositoryImpl implements BoardImageRepositoryCustom{
    private final JPAQueryFactory queryFactory;
    private final QBoardImage boardImage = QBoardImage.boardImage;

    public BoardImageRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }


    @Override
    public void deleteByBoardId(Boards boards) {
        queryFactory
                .delete(boardImage)
                .where(boardImage.boards.eq(boards))
                .execute();

    }
}

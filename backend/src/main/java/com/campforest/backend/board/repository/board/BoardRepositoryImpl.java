package com.campforest.backend.board.repository.board;

import  com.campforest.backend.board.entity.Boards;
import com.campforest.backend.board.entity.QBoards;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.util.List;

public class BoardRepositoryImpl implements BoardRepositoryCustom{

    private final JPAQueryFactory queryFactory;
    private final QBoards boards = QBoards.boards;

    public BoardRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }
    @Override
    public List<Boards> findByUserId(Long userId) {
        return queryFactory
                .selectFrom(boards)
                .where(boards.userId.eq(userId))
                .fetch();
    }

    @Override
    public List<Boards> findByCategory(String category) {
        return queryFactory
                .selectFrom(boards)
                .where(boards.category.eq(category))
                .fetch();
    }

    @Override
    public void updateBoard(Long boardId, String title, String content, String category, boolean isBoardOpen) {

    }
}

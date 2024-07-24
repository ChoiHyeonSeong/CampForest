package com.campforest.backend.chatting.repository.communitychatroom;

import java.util.List;
import java.util.Optional;

import com.campforest.backend.chatting.entity.CommunityChatRoom;
import com.campforest.backend.chatting.entity.QCommunityChatRoom;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

public class CommunityChatRoomRepositoryImpl implements CommunityChatRoomRepositoryCustom {


    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    public CommunityChatRoomRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
        this.entityManager = entityManager;
    }
    QCommunityChatRoom communityChatRoom = QCommunityChatRoom.communityChatRoom;

    @Override
    public CommunityChatRoom findOrCreateChatRoom(Long user1Id, Long user2Id) {

        // 항상 작은 ID를 user1, 큰 ID를 user2로 설정
        Long smallerId = Math.min(user1Id, user2Id);
        Long largerId = Math.max(user1Id, user2Id);

        CommunityChatRoom room = queryFactory
                .selectFrom(communityChatRoom)
                .where(communityChatRoom.user1.eq(smallerId)
                        .and(communityChatRoom.user2.eq(largerId)))
                .fetchOne();

        if (room == null) {
            room = CommunityChatRoom.builder()
                    .user1(smallerId)
                    .user2(largerId)
                    .build();

            entityManager.persist(room);
        }

        return room;
    }

}
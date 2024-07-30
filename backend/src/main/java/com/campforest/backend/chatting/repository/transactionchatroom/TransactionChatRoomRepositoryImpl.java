package com.campforest.backend.chatting.repository.transactionchatroom;

import java.util.List;


import com.campforest.backend.chatting.entity.QTransactionChatRoom;
import com.campforest.backend.chatting.entity.TransactionChatRoom;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.model.QProduct;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

public class TransactionChatRoomRepositoryImpl implements TransactionChatRoomRepositoryCustom {


    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    public TransactionChatRoomRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
        this.entityManager = entityManager;
    }
    QTransactionChatRoom transactionChatRoom = QTransactionChatRoom.transactionChatRoom;
    QProduct product = QProduct.product;
    @Override
    public TransactionChatRoom findOrCreateChatRoom(Long productId,Long buyerId, Long sellerId) {


        TransactionChatRoom room = queryFactory
                .selectFrom(transactionChatRoom)
            .leftJoin(product).on(transactionChatRoom.productId.eq(product.id))
                .where(transactionChatRoom.buyerId.eq(buyerId)
                        .and(transactionChatRoom.sellerId.eq(sellerId))
                            .and(transactionChatRoom.productId.eq(productId)))
                .fetchOne();

        if (room == null) {
            ProductType productType = queryFactory
                .select(product.productType)
                .from(product)
                .where(product.id.eq(productId))
                .fetchOne();


            room = TransactionChatRoom.builder()
                    .productId(productId)
                    .sellerId(sellerId)
                    .buyerId(buyerId)
                    .productType(productType)
                    .build();

            entityManager.persist(room);
        }

        return room;
    }
    // @Override
    // public List<TransactionChatRoom> findByUser1IdOrUser2Id(Long buyerId, Long sellerId) {
    //     return queryFactory
    //             .selectFrom(transactionChatRoom)
    //             .where(transactionChatRoom.buyerId.eq(buyerId)
    //                     .or(transactionChatRoom.sellerId.eq(sellerId)))
    //             .fetch();
    // }

}
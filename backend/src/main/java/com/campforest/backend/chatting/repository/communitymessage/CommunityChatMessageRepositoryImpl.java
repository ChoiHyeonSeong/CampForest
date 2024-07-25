package com.campforest.backend.chatting.repository.communitymessage;// package com.blog.chatting.repository.chatmessage;


 import com.campforest.backend.chatting.entity.CommunityChatMessage;
 import com.campforest.backend.chatting.entity.QCommunityChatMessage;
 import com.querydsl.jpa.impl.JPAQueryFactory;
 import jakarta.persistence.EntityManager;

 import java.util.List;
 import java.util.Optional;

 public class CommunityChatMessageRepositoryImpl implements CommunityChatMessageRepositoryCustom{


     private final JPAQueryFactory queryFactory;
    QCommunityChatMessage communityChatMessage = QCommunityChatMessage.communityChatMessage;
     public CommunityChatMessageRepositoryImpl(EntityManager entityManager) {
         this.queryFactory = new JPAQueryFactory(entityManager);
     }
     @Override
     public List<CommunityChatMessage> findByChatRoom(Long roomId) {

         return queryFactory
                 .selectFrom(communityChatMessage)
                 .where(communityChatMessage.roomId.eq(roomId))
                 .orderBy(communityChatMessage.createdAt.asc())
                 .fetch();
     }

     @Override
     public Long countUnreadMessagesForUser(Long roomId, Long userId) {

         return  queryFactory
                 .select(communityChatMessage.count())
                 .from(communityChatMessage)
                 .where(communityChatMessage.roomId.eq(roomId)
                         .and(communityChatMessage.senderId.ne(userId))
                         .and(communityChatMessage.isRead.eq(false)))
                 .fetchOne();
     }

 }

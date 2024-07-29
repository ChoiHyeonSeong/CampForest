package com.campforest.backend.chatting.repository.communitymessage;// package com.blog.chatting.repository.chatmessage;


 import com.campforest.backend.chatting.entity.CommunityChatMessage;
 import com.campforest.backend.chatting.entity.QCommunityChatMessage;
 import com.querydsl.jpa.impl.JPAQueryFactory;
 import jakarta.persistence.EntityManager;

 import java.time.LocalDateTime;
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

     @Override
     public List<CommunityChatMessage> findUnreadMessagesForUser(Long roomId, Long userId) {

         return queryFactory
                 .selectFrom(communityChatMessage)
                 .where(communityChatMessage.roomId.eq(roomId)
                         .and(communityChatMessage.senderId.ne(userId))
                         .and(communityChatMessage.isRead.eq(false)))
                 .fetch();
     }

     @Override
     public CommunityChatMessage findTopByChatRoom_RoomIdOrderByCreatedAtDesc(Long roomId) {
         QCommunityChatMessage message = QCommunityChatMessage.communityChatMessage;

         CommunityChatMessage latestMessage = queryFactory
                 .selectFrom(message)
                 .where(message.roomId.eq(roomId))
                 .orderBy(message.createdAt.desc())
                 .fetchFirst();

         return latestMessage != null ? latestMessage : createEmptyMessage(roomId);
     }

     private CommunityChatMessage createEmptyMessage(Long roomId) {
         return CommunityChatMessage.builder()
                 .roomId(roomId)
                 .content("")
                 .senderId(null)
                 .createdAt(LocalDateTime.now())
                 .build();
     }

 }

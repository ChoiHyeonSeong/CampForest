package com.campforest.backend.chatting.repository.communitymessage;// package com.blog.chatting.repository.chatmessage;


 import com.querydsl.jpa.impl.JPAQueryFactory;
 import jakarta.persistence.EntityManager;

 import java.util.List;
 import java.util.Optional;

 public class CommunityChatMessageRepositoryImpl implements CommunityChatMessageRepositoryCustom{


     private final JPAQueryFactory queryFactory;

     public CommunityChatMessageRepositoryImpl(EntityManager entityManager) {
         this.queryFactory = new JPAQueryFactory(entityManager);
     }


 }

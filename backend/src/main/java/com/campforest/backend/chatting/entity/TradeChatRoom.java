package com.campforest.backend.chatting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@Entity(name = "trade_chat_room")
@Table(name = "trade_chat_room")
public class TradeChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long roomId;

    @Column(name = "user1_id")
    private Long user1;

    @Column(name = "user2_id")
    private Long user2;

    @Column(name = "unread_count")
    private Long unreadCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    private Long productId;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

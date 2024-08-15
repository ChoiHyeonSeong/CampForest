package com.campforest.backend.chatting.entity;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.ProductType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@NoArgsConstructor
@Setter
@Getter
@Entity(name = "transaction_chat_room")
@Table(name = "transaction_chat_room")
public class TransactionChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "buyer_id")
    private Long buyerId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_type")
    @Enumerated(EnumType.STRING)
    private ProductType productType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "write_review_buyer")
    private boolean writeBuyer;

    @Column(name = "write_review_seller")
    private boolean writeSeller;

    @Column(name = "is_hidden")
    private boolean isHidden;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

package com.campforest.backend.chatting.dto;

import lombok.Data;

@Data
public class CommunityChatDto {
    private Long roomId;
    private Long user1Id;
    private Long user2Id;
}

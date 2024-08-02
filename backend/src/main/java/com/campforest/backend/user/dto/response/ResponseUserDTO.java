package com.campforest.backend.user.dto.response;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.campforest.backend.user.model.Gender;
import com.campforest.backend.user.model.Role;
import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class ResponseUserDTO {

    private Long userId;
    private String email;
    private String nickname;
    private String profileImage;
    @Setter
    private Map<String, Object> similarUsers;

    public static ResponseUserDTO fromEntity(Users user) {
        return ResponseUserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .build();
    }
}
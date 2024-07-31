package com.campforest.backend.user.dto.response;

import java.util.Date;

import com.campforest.backend.user.model.Gender;
import com.campforest.backend.user.model.Role;
import com.campforest.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseUserDTO {

    private Long userId;
    private String userName;
    private String email;
    private Role role;
    private Date birthdate;
    private Gender gender;
    private boolean isOpen;
    private String nickname;
    private String phoneNumber;
    private String introduction;
    private String profileImage;
    private Date createdAt;
    private Date modifiedAt;

    public static ResponseUserDTO fromEntity(Users user) {
        return ResponseUserDTO.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .role(user.getRole())
                .birthdate(user.getBirthdate())
                .gender(user.getGender())
                .isOpen(user.isOpen())
                .nickname(user.getNickname())
                .phoneNumber(user.getPhoneNumber())
                .introduction(user.getIntroduction())
                .createdAt(user.getCreatedAt())
                .modifiedAt(user.getModifiedAt())
                .build();
    }
}
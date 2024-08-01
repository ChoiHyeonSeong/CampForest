package com.campforest.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.user.model.UserImage;

public interface UserImageRepository extends JpaRepository<UserImage, Long> {
}

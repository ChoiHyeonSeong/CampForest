package com.campforest.backend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.board.entity.BoardImage;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
}

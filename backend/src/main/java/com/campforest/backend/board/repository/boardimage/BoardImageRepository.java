package com.campforest.backend.board.repository.boardimage;

import java.util.List;

import com.campforest.backend.board.entity.Boards;
import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.board.entity.BoardImage;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long>,BoardImageRepositoryCustom {

}

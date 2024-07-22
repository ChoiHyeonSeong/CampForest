package com.campforest.backend.board.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Boards;

@Repository
public interface BoardRepository extends JpaRepository<Boards, Long>, BoardRepositoryCustom {

}

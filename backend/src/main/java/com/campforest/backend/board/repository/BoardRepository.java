package com.campforest.backend.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Boards;
@Repository
public interface BoardRepository extends JpaRepository<Boards,Long> {

	@Query("SELECT b FROM Boards b WHERE b.userId = :userId")
	List<Boards> findByUserId(@Param("userId") Long userId);
}

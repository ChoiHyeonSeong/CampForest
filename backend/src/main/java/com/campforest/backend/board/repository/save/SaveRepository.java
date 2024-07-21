package com.campforest.backend.board.repository.save;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Save;

@Repository
public interface SaveRepository extends JpaRepository<Save, Long>, SaveRepositoryCustom {

}

package com.campforest.backend.board.repository.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.board.entity.Likes;

@Repository
public interface LikeRepository extends JpaRepository<Likes, Long>,LikeRepositoryCustom {

}

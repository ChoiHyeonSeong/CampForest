package com.campforest.backend.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campforest.backend.user.dto.response.ResponseFollowDTO;
import com.campforest.backend.user.model.Follow;
import com.campforest.backend.user.model.Users;

public interface FollowRepository extends JpaRepository<Follow, Long> {
	@Query("SELECT new com.campforest.backend.user.dto.response.ResponseFollowDTO(u.userId, u.nickname, COALESCE(ui.imageUrl, '')) "
		+ "FROM Users u "
		+ "LEFT JOIN u.userImage ui "
		+ "WHERE u.userId IN (SELECT f.follower.userId FROM Follow f WHERE f.followee.userId = :userId)")
	List<ResponseFollowDTO> findFollowerDTOsByUserId(@Param("userId") Long userId);

	@Query("SELECT new com.campforest.backend.user.dto.response.ResponseFollowDTO(u.userId, u.nickname, COALESCE(ui.imageUrl, '')) "
		+ "FROM Users u "
		+ "LEFT JOIN u.userImage ui "
		+ "WHERE u.userId IN (SELECT f.followee.userId FROM Follow f WHERE f.follower.userId = :userId)")
	List<ResponseFollowDTO> findFollowingDTOsByUserId(@Param("userId") Long userId);

	Optional<Follow> findByFollowerAndFollowee(Users follower, Users followee);
}

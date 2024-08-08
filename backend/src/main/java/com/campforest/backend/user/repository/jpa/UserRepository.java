package com.campforest.backend.user.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.campforest.backend.user.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

	Optional<Users> findByEmail(String email);

	Optional<Users> findByUserId(Long userId);

	@Query("SELECT u FROM Users u WHERE u.nickname LIKE %:nickname% AND u.userId > :cursor ORDER BY u.userId, u.nickname")
	List<Users> findByNicknameContainingAndIdGreaterThan(
		@Param("nickname") String nickname,
		@Param("cursor") Long cursor,
		Pageable pageable);

	@Query("SELECT COUNT(u) FROM Users u WHERE u.nickname LIKE %:nickname%")
	long countByNicknameContaining(@Param("nickname") String nickname);

	boolean existsByPhoneNumber(String phoneNumber);

}

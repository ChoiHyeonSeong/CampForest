package com.campforest.backend.user.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.user.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

	Optional<Users> findByEmail(String email);

	Optional<Users> findByUserId(Long userId);

	List<Users> findByNicknameContaining(String nickname);

	boolean existsByPhoneNumber(String phoneNumber);

}

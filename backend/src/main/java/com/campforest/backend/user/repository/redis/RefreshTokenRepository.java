package com.campforest.backend.user.repository.redis;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.user.model.RefreshToken;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
	List<RefreshToken> findAllByUserEmail(String userEmail);
}

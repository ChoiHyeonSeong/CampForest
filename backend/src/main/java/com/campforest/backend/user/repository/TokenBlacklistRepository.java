package com.campforest.backend.user.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.user.model.TokenBlacklist;

@Repository
public interface TokenBlacklistRepository extends CrudRepository<TokenBlacklist, String> {
}

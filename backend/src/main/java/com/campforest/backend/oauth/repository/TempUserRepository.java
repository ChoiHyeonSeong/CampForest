package com.campforest.backend.oauth.repository;

import org.springframework.data.repository.CrudRepository;

import com.campforest.backend.oauth.model.TempUser;

public interface TempUserRepository extends CrudRepository<TempUser, String> {
}

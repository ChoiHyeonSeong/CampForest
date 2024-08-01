package com.campforest.backend.oauth.repository;

import org.springframework.data.repository.CrudRepository;

import com.campforest.backend.oauth.model.OAuthCodeToken;

public interface OAuthCodeTokenRepository extends CrudRepository<OAuthCodeToken, String> {
}

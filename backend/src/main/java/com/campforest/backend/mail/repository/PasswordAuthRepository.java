package com.campforest.backend.mail.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.mail.model.PasswordAuth;

@Repository
public interface PasswordAuthRepository extends CrudRepository<PasswordAuth, String> {
}

package com.campforest.backend.user.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;

import com.campforest.backend.user.model.Users;

public interface UserService {

	void registByEmail(Users users);

	Optional<Users> findByEmail(String email);

	void deleteByEmail(String email);

	Authentication authenticateUser(String email, String password);
}

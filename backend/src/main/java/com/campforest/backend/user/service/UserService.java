package com.campforest.backend.user.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;

import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.model.Users;

public interface UserService {

	void registUser(RequestRegisterDTO requestDTO);

	Optional<Users> findByEmail(String email);

	void deleteByEmail(String email);

	Authentication authenticateUser(String email, String password);
}

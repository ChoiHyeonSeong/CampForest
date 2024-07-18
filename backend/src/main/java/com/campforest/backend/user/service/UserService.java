package com.campforest.backend.user.service;

import org.springframework.stereotype.Service;

import com.campforest.backend.user.model.Users;

public interface UserService {

	void registByEmail(Users users);

}

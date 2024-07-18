package com.campforest.backend.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;

	@Override
	@Transactional
	public void registByEmail(Users users) {
		userRepository.save(users);
	}
}

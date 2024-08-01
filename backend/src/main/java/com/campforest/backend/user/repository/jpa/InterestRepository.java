package com.campforest.backend.user.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.user.model.Interest;

public interface InterestRepository extends JpaRepository<Interest, Long> {
	Interest findByInterest(String interest);
}

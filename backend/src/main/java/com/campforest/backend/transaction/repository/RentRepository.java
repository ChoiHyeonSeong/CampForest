package com.campforest.backend.transaction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.transaction.model.Rent;

public interface RentRepository extends JpaRepository<Rent, Long> {
}

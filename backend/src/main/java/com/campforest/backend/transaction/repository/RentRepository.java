package com.campforest.backend.transaction.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;

public interface RentRepository extends JpaRepository<Rent, Long> {

	Optional<Rent> findByProductIdAndRenterId(Long productId, Long renterId);

	Optional<Rent> findRentByRenterIdAndOwnerId(Long renterId, Long ownerId);

	Optional<Rent> findByProductIdAndRenterIdAndOwnerId(Long productId, Long renterId, Long ownerId);

	List<Rent> findByProductIdAndRentStartDateAfter(Long productId, LocalDate currentDate);

}

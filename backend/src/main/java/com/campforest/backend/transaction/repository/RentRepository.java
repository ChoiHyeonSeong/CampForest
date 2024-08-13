package com.campforest.backend.transaction.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;

public interface RentRepository extends JpaRepository<Rent, Long> {

	Optional<Rent> findByProductIdAndRequesterId(Long productId, Long requesterId);

	Optional<Rent> findByRequesterIdAndReceiverId(Long requesterId, Long receiverId);

	Optional<Rent> findByProductIdAndRequesterIdAndReceiverId(Long productId, Long requesterId, Long receiverId);

	List<Rent> findByProductIdAndRentStartDateAfter(Long productId, LocalDate currentDate);

	Optional<Rent> findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(
		Long productId, Long requesterId, Long receiverId);

}

package com.campforest.backend.transaction.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campforest.backend.transaction.model.Rent;
import com.campforest.backend.transaction.model.Sale;
import com.campforest.backend.transaction.model.TransactionStatus;

public interface RentRepository extends JpaRepository<Rent, Long> {

	List<Rent> findByProductIdAndRequesterId(Long productId, Long requesterId);

	Optional<Rent> findByRequesterIdAndReceiverId(Long requesterId, Long receiverId);

	Optional<Rent> findByProductIdAndRequesterIdAndReceiverId(Long productId, Long requesterId, Long receiverId);

	@Query("SELECT distinct r FROM Rent r WHERE r.product.id = :productId AND r.rentStartDate >= :currentDate")
	List<Rent> findReservedRents(@Param("productId") Long productId, @Param("currentDate") LocalDateTime  currentDate);

	Optional<Rent> findTopByProductIdAndRequesterIdAndReceiverIdOrderByCreatedAtDesc(
		Long productId, Long requesterId, Long receiverId);

	List<Rent> findByProductIdAndRentStatusAndRentEndDateAfter(Long productId, TransactionStatus rentStatus, LocalDateTime newStartDate);

}

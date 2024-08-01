package com.campforest.backend.transaction.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.transaction.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {

	Optional<Sale> findByProductIdAndRequesterId(Long productId, Long requesterId);

	Optional<Sale> findByRequesterIdAndReceiverId(Long requesterId, Long receiverId);

	Optional<Sale> findByProductIdAndRequesterIdAndReceiverId(Long productId, Long requesterId, Long receiverId);
}

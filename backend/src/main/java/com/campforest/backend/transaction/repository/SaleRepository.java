package com.campforest.backend.transaction.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.transaction.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {

	Optional<Sale> findByProductIdAndBuyerId(Long productId, Long buyerId);

	Optional<Sale> findSaleBySellerIdAndBuyerId(Long sellerId, Long buyerId);

	Optional<Sale> findByProductIdAndSellerIdAndBuyerId(Long productId, Long sellerId, Long buyerId);

}

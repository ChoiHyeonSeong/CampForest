package com.campforest.backend.transaction.model;

import java.time.LocalDateTime;

import com.campforest.backend.product.model.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rent_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	@Column(name = "renter_id")
	private Long renterId;

	@Column(name = "owner_id")
	private Long ownerId;

	@Column(name = "rent_start_date")
	private LocalDateTime rentStartDate;

	@Column(name = "rent_end_date")
	private LocalDateTime rentEndDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "rent_status")
	private TransactionStatus rentStatus;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public void requestRent() {
		this.rentStatus = TransactionStatus.REQUESTED;
	}

	public void receiveRent() {
		this.rentStatus = TransactionStatus.RECEIVED;
	}

	public void acceptRent() {
		this.rentStatus = TransactionStatus.RESERVED;
	}

	public void confirmRent() {
		this.rentStatus = TransactionStatus.CONFIRMED;
	}
}

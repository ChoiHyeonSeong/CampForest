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

	@Column(name = "requester_id")
	private Long requesterId;

	@Column(name = "receiver_id")
	private Long receiverId;

	@Column(name = "rent_start_date")
	private LocalDateTime rentStartDate;

	@Column(name = "rent_end_date")
	private LocalDateTime rentEndDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "rent_status")
	private TransactionStatus rentStatus;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "deposit")
	private Long deposit;

	@Column(name = "modified_at")
	private LocalDateTime modifiedAt;

	@Column(columnDefinition = "boolean default false")
	private boolean confirmedByBuyer; // 추가된 필드: 구매자가 확인했는지 여부

	@Column(columnDefinition = "boolean default false")
	private boolean confirmedBySeller; // 추가된 필드: 판매자가 확인했는지 여부

	public void requestRent() {
		this.rentStatus = TransactionStatus.REQUESTED;
	}

	public void receiveRent() {
		this.rentStatus = TransactionStatus.RECEIVED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void acceptRent() {
		this.rentStatus = TransactionStatus.RESERVED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void confirmRent(String requestRole) {
		if ("buyer".equals(requestRole)) {
			this.confirmedByBuyer = true;
		} else if ("seller".equals(requestRole)) {
			this.confirmedBySeller = true;
		}
		this.modifiedAt = LocalDateTime.now();
	}

	public Rent toEntityInverse() {
		return Rent.builder()
			.product(this.product)
			.renterId(this.renterId)
			.ownerId(this.ownerId)
			.requesterId(this.receiverId)
			.receiverId(this.requesterId)
			.rentStatus(TransactionStatus.RECEIVED)
			.rentStartDate(this.rentStartDate)
			.deposit(this.deposit)
			.rentEndDate(this.rentEndDate)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.build();
	}

	public boolean isFullyConfirmed() {
		return this.confirmedByBuyer && this.confirmedBySeller;
	}
}

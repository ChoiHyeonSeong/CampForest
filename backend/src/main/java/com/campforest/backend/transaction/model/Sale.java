package com.campforest.backend.transaction.model;

import java.time.LocalDateTime;
import java.util.List;

import com.campforest.backend.product.model.Product;
import com.campforest.backend.review.model.Review;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Sale {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sale_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	@JsonBackReference
	private Product product;

	@Column(name = "buyer_id")
	private Long buyerId;

	@Column(name = "seller_id")
	private Long sellerId;

	@Column(name = "requester_id")
	private Long requesterId;

	@Column(name = "receiver_id")
	private Long receiverId;

	@Enumerated(EnumType.STRING)
	@Column(name = "sale_status")
	private TransactionStatus saleStatus;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "modified_at")
	private LocalDateTime modifiedAt;

	@Column(name = "meeting_time")
	private LocalDateTime meetingTime;

	@Column(name = "meeting_place")
	private String meetingPlace;

	@OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference
	private List<Review> reviews;

	@Column(columnDefinition = "boolean default false")
	private boolean confirmedByBuyer;

	@Column(columnDefinition = "boolean default false")
	private boolean confirmedBySeller;

	@Column(name = "real_price")
	private Long realPrice;

	@Column(name = "latitude")
	private Double latitude;

	@Column(name = "longitude")
	private Double longitude;

	public void requestSale() {
		this.saleStatus = TransactionStatus.REQUESTED;
	}

	public void receiveSale() {
		this.saleStatus = TransactionStatus.RECEIVED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void acceptSale() {
		this.saleStatus = TransactionStatus.RESERVED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void denySale() {
		this.saleStatus = TransactionStatus.DENIED;
		this.modifiedAt = LocalDateTime.now();
	}

	public void confirmSale(boolean isOwner) {
		if (isOwner) {
			this.confirmedBySeller = true;
		} else {
			this.confirmedByBuyer = true;
		}
		this.modifiedAt = LocalDateTime.now();
	}

	public Sale toEntityInverse() {
		return Sale.builder()
			.product(this.product)
			.buyerId(this.buyerId)
			.sellerId(this.sellerId)
			.requesterId(this.receiverId)
			.receiverId(this.requesterId)
			.saleStatus(TransactionStatus.RECEIVED)
			.createdAt(LocalDateTime.now())
			.modifiedAt(LocalDateTime.now())
			.latitude(this.latitude)
			.longitude(this.longitude)
			.build();
	}

	public boolean isFullyConfirmed() {
		return this.confirmedByBuyer && this.confirmedBySeller;
	}

	public void confirmSaleStatus() {
		this.saleStatus = TransactionStatus.CONFIRMED;
		this.modifiedAt = LocalDateTime.now();
	}
}

package com.campforest.backend.product.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

	@Id
	@GeneratedValue
	@Column(name = "product_id")
	private Long id;

	private Long user_id;

	@Enumerated(EnumType.STRING)
	private Category category;

	@Column(name = "product_name")
	private String productName;

	@Column(name = "product_price")
	private Long productPrice;

	@Column(name = "product_content")
	private String productContent;
	private String location;

	@Column(name = "product_type")
	@Enumerated(EnumType.STRING)
	private ProductType productType;

	//관심수
	@ColumnDefault("0")
	private Long interest_hit;

	//조회수
	@ColumnDefault("0")
	private Long hit;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "modified_at")
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
	private List<ProductImage> productImages;
}

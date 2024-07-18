package com.campforest.backend.product.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Category {

	@Id @GeneratedValue
	@Column(name = "category_id")
	private Long id;

	@Column(name = "category_name")
	private String categoryName;

	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
	private List<Product> products;
}

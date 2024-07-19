package com.campforest.backend.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.product.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}

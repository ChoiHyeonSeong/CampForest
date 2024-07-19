package com.campforest.backend.product.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}
}

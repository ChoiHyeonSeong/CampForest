package com.campforest.backend.product.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.service.CategoryService;
import com.campforest.backend.product.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController("/product")
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductController {

	private final ProductService productService;
	private final CategoryService categoryService;

	@GetMapping("/category")
	public ApiResponse<?> getCategory() {
		List<Category> categories = categoryService.getAllCategories();
		return ApiResponse.createSuccess(categories, "카테고리 요청 성공0");
	}



}

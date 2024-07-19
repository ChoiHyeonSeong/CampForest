package com.campforest.backend.product.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.repository.ProductImageRepository;
import com.campforest.backend.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;

	private final ProductImageRepository productImageRepository;

	@Transactional
	public void createProduct(ProductRegistDto productRegistDto) {

		Product product = productRegistDto.toEntity();

		Product savedProduct = productRepository.save(product);

		List<ProductImage> productImages = new ArrayList<>();
		for (String imageUrl : productRegistDto.getImageUrls()) {
			ProductImage productImage = new ProductImage();
			productImage.setProduct(savedProduct);
			productImage.setImageUrl(imageUrl);
			productImages.add(productImage);
		}
		productImageRepository.saveAll(productImages);
	}
}

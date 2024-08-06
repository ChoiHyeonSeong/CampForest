package com.campforest.backend.product.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.SaveProduct;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.product.repository.SaveProductRepository;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaveProductService {

	private final UserRepository userRepository;

	private final ProductRepository productRepository;

	private final SaveProductRepository saveProductRepository;

	public SaveProduct addSave(Long userId, Long productId) {

		Users user = userRepository.findByUserId(userId)
			.orElseThrow(() -> new IllegalArgumentException("찾는 사용자가 없습니다"));

		Product product = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("찾는 상품 게시글이 없습니다"));

		SaveProduct sProduct = SaveProduct.builder()
			.user(user)
			.product(product)
			.createdAt(LocalDateTime.now())
			.build();

		return saveProductRepository.save(sProduct);
	}

	public void deleteProduct(Long userId, Long productId) {

		Users user = userRepository.findByUserId(userId)
			.orElseThrow(() -> new IllegalArgumentException("찾는 사용자가 없습니다"));

		SaveProduct saveProduct = saveProductRepository.findByUserUserIdAndProductId(userId, productId)
			.orElseThrow(() -> new IllegalArgumentException("관심 상품 없음요 "));

		user.deleteSavedProduct(saveProduct);

		saveProductRepository.delete(saveProduct);
	}

	public List<SaveProduct> getSaveList(Long userId) {
		return saveProductRepository.findAllByUserUserId(userId);
	}
}

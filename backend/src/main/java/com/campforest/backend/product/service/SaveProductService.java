package com.campforest.backend.product.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import com.campforest.backend.common.CursorResult;
import com.campforest.backend.product.dto.PageResult;
import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductSearchDto;
import com.campforest.backend.product.dto.SaveProductDto;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.model.SaveProduct;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.product.repository.SaveProductCustomRepository;
import com.campforest.backend.product.repository.SaveProductRepository;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaveProductService {

	private final UserRepository userRepository;

	private final ProductRepository productRepository;

	private final SaveProductRepository saveProductRepository;

	private final UserService userService;


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

		SaveProduct saveProduct = saveProductRepository.findByUserUserIdAndProductId(userId, productId)
			.orElseThrow(() -> new IllegalArgumentException("관심 상품 없음요 "));

		saveProductRepository.delete(saveProduct);
	}

	public PageResult<SaveProductDto> getSaveList(Long userId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<SaveProduct> saveProductsPage = saveProductRepository.findAllByUserUserId(userId, pageable);

		List<SaveProductDto> saveProducts = saveProductsPage.stream()
			.map(saveProduct -> {
				ProductSearchDto productSearchDto = getProductSearchDto(saveProduct.getProduct().getId());
				return new SaveProductDto(saveProduct, productSearchDto);
			})
			.collect(Collectors.toList());

		return new PageResult<>(saveProducts, saveProductsPage.getTotalElements(), saveProductsPage.getNumber(), saveProductsPage.getSize());
	}

	public ProductSearchDto getProductSearchDto(Long productId) {
		Product findProduct = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		Users user = userRepository.findById(findProduct.getUserId())
			.orElseThrow(() -> new IllegalArgumentException("유저 없음요"));

		String imageUrl = findProduct.getProductImages()
			.stream().map(ProductImage::getImageUrl)
			.findFirst()
			.orElse(null); // 사진이 없을 경우 null 반환

		return new ProductSearchDto(findProduct, imageUrl, user.getNickname(), user.getUserImage());
	}

	public CursorResult<SaveProductDto> getSaveListWithCursor(Long userId, Long cursorId, int size) {
		long totalCount = saveProductRepository.countByUserId(userId);

		List<SaveProduct> saveProducts = saveProductRepository.findAllByUserUserIdWithCursor(userId, cursorId, size + 1);

		List<SaveProductDto> saveProductDtos = saveProducts.stream()
			.limit(size)
			.map(saveProduct -> {
				ProductSearchDto productSearchDto = getProductSearchDto(saveProduct.getProduct().getId());
				productSearchDto.setSaved(true);
				return new SaveProductDto(saveProduct, productSearchDto);
			})
			.collect(Collectors.toList());

		boolean hasNext = saveProducts.size() > size;
		Long nextCursorId = hasNext ? saveProducts.get(size).getId() : null;

		return new CursorResult<>(saveProductDtos, nextCursorId, hasNext, totalCount);
	}
}

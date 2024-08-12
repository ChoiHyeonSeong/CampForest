package com.campforest.backend.product.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.common.CursorResult;
import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.dto.ProductSearchDto;
import com.campforest.backend.product.dto.ProductUpdateDto;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.model.SaveProduct;
import com.campforest.backend.product.repository.ProductImageRepository;
import com.campforest.backend.product.repository.ProductRepository;
import com.campforest.backend.product.repository.SaveProductRepository;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductService {

	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final SaveProductRepository saveProductRepository;
	private final ProductImageRepository productImageRepository;

	public void createProduct(ProductRegistDto productRegistDto) {

		Product product = productRegistDto.toEntity();
		if(productRegistDto.getProductType()==ProductType.RENT) {
			product.setDeposit(productRegistDto.getDeposit());
		}
		Product savedProduct = productRepository.save(product);

		List<ProductImage> productImages = new ArrayList<>();
		for (String imageUrl : productRegistDto.getProductImageUrl()) {
			ProductImage productImage = new ProductImage();
			productImage.setProduct(savedProduct);
			productImage.setImageUrl(imageUrl);
			productImages.add(productImage);
		}
		productImageRepository.saveAll(productImages);
	}

	//게시물 조회기능
	public ProductDetailDto getProduct(Long productId) {
		Product findProduct = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		Users user = userRepository.findById(findProduct.getUserId())
			.orElseThrow(() -> new IllegalArgumentException("유저 없음요 "));

		findProduct.incrementHit(); // 조회수 증가

		productRepository.save(findProduct); // 변경 사항 저장

		List<String> imageUrls = findProduct.getProductImages()
			.stream().map(ProductImage::getImageUrl)
			.collect(Collectors.toList());
		return new ProductDetailDto(findProduct, imageUrls, user.getNickname(), user.getUserImage());
	}

	//게시물 조회기능
	public ProductDetailDto getProductByUserId(Long productId, Long userId) {
		Product findProduct = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		Users user = userRepository.findById(findProduct.getUserId())
			.orElseThrow(() -> new IllegalArgumentException("유저 없음요 "));

		findProduct.incrementHit(); // 조회수 증가
		productRepository.save(findProduct); // 변경 사항 저장

		List<String> imageUrls = findProduct.getProductImages()
			.stream().map(ProductImage::getImageUrl)
			.collect(Collectors.toList());
		boolean isSaved = false;
		if (userId != null) {
			Optional<SaveProduct> saveProduct = saveProductRepository.findByUserUserIdAndProductId(userId,
				productId);
			if (saveProduct.isPresent()) {
				isSaved = true;
			}
		}
		System.out.println(isSaved);
		ProductDetailDto productDetailDto = new ProductDetailDto(findProduct, imageUrls, user.getNickname(), user.getUserImage());
		productDetailDto.setSaved(isSaved);

		return productDetailDto;
	}

	//게시물 수정 기능
	@Transactional
	public void updateProduct(Long productId, ProductUpdateDto productUpdateDto) {
		Product product = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		if(product.getProductType()==ProductType.RENT) {
			product.setDeposit(productUpdateDto.getDeposit());
		}

		product.update(productUpdateDto);

		// 기존 이미지 삭제
		productImageRepository.deleteByProductId(productId);

		// 새로운 이미지 추가
		List<ProductImage> productImages = new ArrayList<>();
		for (String imageUrl : productUpdateDto.getProductImageUrl()) {
			ProductImage productImage = new ProductImage();
			productImage.setProduct(product);
			productImage.setImageUrl(imageUrl);
			productImages.add(productImage);
		}
		productImageRepository.saveAll(productImages);
	}

	//게시물 삭제 기능
	public void deleteProduct(Long productId) {
		Product product = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		productRepository.delete(product);
	}

	@Transactional
	public void deleteProductImage(Long productId, Long imageId) {
		ProductImage productImage = productImageRepository.findById(imageId)
			.orElseThrow(() -> new IllegalArgumentException("이미지 없음요"));

		if (!productImage.getProduct().getId().equals(productId)) {
			throw new IllegalArgumentException("해당 상품의 이미지가 아닙니다");
		}

		productImageRepository.delete(productImage);
	}

	private ProductSearchDto toDto(Product product, boolean isSaved) {
		ProductSearchDto dto = new ProductSearchDto();
		dto.setProductId(product.getId());
		dto.setUserId(product.getUserId());
		dto.setHit(product.getHit());
		dto.setInterestHit(product.getInterest_hit());
		dto.setProductName(product.getProductName());
		dto.setProductPrice(product.getProductPrice());
		dto.setCategory(product.getCategory());
		dto.setProductType(product.getProductType());
		dto.setLocation(product.getLocation());
		List<ProductImage> productImages = product.getProductImages();
		dto.setImageUrl(productImages.get(0).getImageUrl());
		dto.setSaved(isSaved);
		if(product.getProductType()==ProductType.RENT) {
			dto.setDeposit(product.getDeposit());
		}
		else{
			dto.setSold(product.isSold());
		}
		return dto;
	}


	public Optional<Product> getProductById(Long productId) {
		return productRepository.findById(productId);
	}

	public CursorResult<ProductSearchDto> findProductsByDynamicConditionsWithCursor(
		Category category, ProductType productType, Long minPrice, Long maxPrice,
		List<String> locations, String titleKeyword, int size, Long userId, Long findUserId, Long cursorId) {

		long totalCount = productRepository.countProductsByDynamicConditions(
			category, productType, locations, minPrice, maxPrice, findUserId, titleKeyword);

		List<Product> products = productRepository.findProductsByDynamicConditionsWithCursor(
			category, productType, locations, minPrice, maxPrice, findUserId, titleKeyword, size + 1, cursorId);

		Set<Long> savedProductIds = userId != null ?
			saveProductRepository.findAllByUserUserId(userId).stream()
				.map(saveProduct -> saveProduct.getProduct().getId())
				.collect(Collectors.toSet())
			: Set.of();

		List<ProductSearchDto> dtos = products.stream()
			.limit(size)
			.map(product -> toDto(product, userId != null && savedProductIds.contains(product.getId())))
			.collect(Collectors.toList());

		boolean hasNext = products.size() > size;
		Long nextCursorId = hasNext ? products.get(size).getId() : null;

		return new CursorResult<>(dtos, nextCursorId, hasNext, totalCount);
	}
}

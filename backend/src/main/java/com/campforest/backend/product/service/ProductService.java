package com.campforest.backend.product.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.dto.ProductSearchDto;
import com.campforest.backend.product.dto.ProductUpdateDto;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.repository.ProductImageRepository;
import com.campforest.backend.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductService {

	private final ProductRepository productRepository;

	private final ProductImageRepository productImageRepository;

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

	//게시물 조회기능
	public ProductDetailDto getProduct(Long productId) {
		Product findProduct = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		List<String> imageUrls = findProduct.getProductImages()
			.stream().map(ProductImage::getImageUrl)
			.collect(Collectors.toList());
		log.info(imageUrls.toString());
		return new ProductDetailDto(findProduct, imageUrls);
	}

	//게시물 수정 기능
	@Transactional
	public void updateProduct(Long productId, ProductUpdateDto productUpdateDto) {
		Product product = productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("상품 없음요"));

		product.update(productUpdateDto);

		// 기존 이미지 삭제
		productImageRepository.deleteByProductId(productId);

		// 새로운 이미지 추가
		List<ProductImage> productImages = new ArrayList<>();
		for (String imageUrl : productUpdateDto.getImageUrls()) {
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

	private ProductSearchDto toDto(Product product) {
		ProductSearchDto dto = new ProductSearchDto();
		dto.setProductId(product.getId());
		dto.setProductName(product.getProductName());
		dto.setProductPrice(product.getProductPrice());
		dto.setCategory(product.getCategory());
		dto.setProductType(product.getProductType());
		dto.setLocation(product.getLocation());
		List<ProductImage> productImages = product.getProductImages();
		dto.setImageUrl(productImages.get(0).getImageUrl());
		return dto;
	}

	public Page<ProductSearchDto> findProductsByDynamicConditions(Category category, ProductType productType, Long minPrice,
		Long maxPrice, List<String> locations, String titleKeyword, Pageable pageable) {
		Page<Product> products = productRepository.findProductsByDynamicConditions(category, productType, locations, minPrice, maxPrice, titleKeyword, pageable);
		return products.map(this::toDto);
	}
}

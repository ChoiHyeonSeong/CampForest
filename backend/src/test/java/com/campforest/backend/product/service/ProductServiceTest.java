package com.campforest.backend.product.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductImage;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.repository.ProductImageRepository;
import com.campforest.backend.product.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

	@Mock
	private ProductRepository productRepository;

	@Mock
	private ProductImageRepository productImageRepository;

	@InjectMocks
	private ProductService productService;

	private Product mockProduct;

	private ProductRegistDto productRegistDto;

	@BeforeEach
	void setUp() {
		productRegistDto = new ProductRegistDto();
		productRegistDto.setProductName("4인용텐트");
		productRegistDto.setProductPrice(5000L);
		productRegistDto.setProductContent("ASdasda");
		productRegistDto.setProductType(ProductType.RENT);
		productRegistDto.setCategory(Category.버너_화로);

		List<String> imageUrls = new ArrayList<>();
		imageUrls.add("DASDAS");
		productRegistDto.setImageUrls(imageUrls);

		mockProduct = productRegistDto.toEntity();
		when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

		productService.createProduct(productRegistDto);

		ProductImage productImage = new ProductImage();
		productImage.setImageUrl("DASDAS");
		productImage.setProduct(mockProduct);
		mockProduct.setProductImages(Arrays.asList(productImage));
	}

	@Test
	@DisplayName("Product 생성 기능 테스트")
	void createProduct() {

		verify(productRepository).save(any(Product.class));
		verify(productImageRepository).saveAll(anyList());
	}

	@Test
	@DisplayName("Product 조회 기능 테스트 - 성공")
	void getProductSuccess() {

		Long productId = 1L;

		when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

		ProductDetailDto productDetailDto = productService.getProduct(productId);

		assertEquals(mockProduct.getProductName(), productDetailDto.getProductName());
		assertEquals(mockProduct.getProductPrice(), productDetailDto.getProductPrice());
		assertEquals(Arrays.asList("DASDAS"), productDetailDto.getImageUrls());

		verify(productRepository).findById(productId);
	}

	@Test
	@DisplayName("Product 조회 기능 테스트 - 실패")
	void getProductFail() {
		Long productId = 1L;

		when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

		assertThrows(IllegalArgumentException.class, () -> productService.getProduct(productId));

		verify(productRepository).findById(productId);
	}

}

package com.campforest.backend.product.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

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
import com.campforest.backend.product.dto.ProductUpdateDto;
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
		productRegistDto.setProductImageUrl(imageUrls);

		mockProduct = productRegistDto.toEntity();
		mockProduct.setId(1L);  // ID 설정

		when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

		productService.createProduct(productRegistDto);

		ProductImage productImage = new ProductImage();
		productImage.setId(1L);  // ID 설정
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

	@Test
	@DisplayName("Product 수정 기능 테스트")
	void updateProduct() {
		Long productId = 1L;

		ProductUpdateDto productUpdateDto = new ProductUpdateDto();
		productUpdateDto.setProductName("수정된 텐트");
		productUpdateDto.setProductPrice(6000L);
		productUpdateDto.setProductContent("수정된 설명");
		productUpdateDto.setCategory(Category.코펠_식기);
		productUpdateDto.setProductImageUrl(Arrays.asList("NEW_URL1", "NEW_URL2"));

		when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

		productService.updateProduct(productId, productUpdateDto);

		verify(productRepository).findById(productId);
		verify(productImageRepository).deleteByProductId(productId);
		verify(productImageRepository, times(2)).saveAll(anyList());

		assertEquals(productUpdateDto.getProductName(), mockProduct.getProductName());
		assertEquals(productUpdateDto.getProductPrice(), mockProduct.getProductPrice());
		assertEquals(productUpdateDto.getProductContent(), mockProduct.getProductContent());
		assertEquals(productUpdateDto.getCategory(), mockProduct.getCategory());
	}

	@Test
	@DisplayName("Product 이미지 삭제 기능 테스트 - 성공")
	void deleteProductImageSuccess() {
		Long productId = 1L;
		Long imageId = 1L;

		ProductImage productImage = new ProductImage();
		productImage.setId(imageId);
		productImage.setImageUrl("DASDAS");
		productImage.setProduct(mockProduct);

		when(productImageRepository.findById(imageId)).thenReturn(Optional.of(productImage));

		productService.deleteProductImage(productId, imageId);

		verify(productImageRepository).findById(imageId);
		verify(productImageRepository).delete(productImage);
	}

	@Test
	@DisplayName("Product 이미지 삭제 기능 테스트 - 실패")
	void deleteProductImageFail() {
		Long productId = 1L;
		Long imageId = 1L;

		when(productImageRepository.findById(anyLong())).thenReturn(Optional.empty());

		assertThrows(IllegalArgumentException.class, () -> productService.deleteProductImage(productId, imageId));

		verify(productImageRepository).findById(imageId);
	}

	@Test
	@DisplayName("Product 삭제 기능 테스트 - 성공")
	void deleteProductSuccess() {
		Long productId = 1L;

		when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

		productService.deleteProduct(productId);

		verify(productRepository).findById(productId);
		verify(productRepository).delete(mockProduct);
	}

	@Test
	@DisplayName("Product 삭제 기능 테스트 - 실패")
	void deleteProductFail() {
		Long productId = 1L;

		when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

		assertThrows(IllegalArgumentException.class, () -> productService.deleteProduct(productId));

		verify(productRepository).findById(productId);
	}
}

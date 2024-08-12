package com.campforest.backend.product.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.CursorResult;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.dto.ProductSearchDto;
import com.campforest.backend.product.dto.ProductUpdateDto;
import com.campforest.backend.product.model.Category;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.ProductType;
import com.campforest.backend.product.service.ProductService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductController {

	private final ProductService productService;
	private final S3Service s3Service;
	private final UserService userService;

	//게시물 작성
	@PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ApiResponse<?> createProduct(Authentication authentication,
		@RequestPart(value = "files", required = false) MultipartFile[] files,
		@RequestPart(value = "productRegistDto") ProductRegistDto productRegistDto
	) throws Exception {
		Users users = userService.findByEmail(authentication.getName())
			.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

		List<String> imageUrls = new ArrayList<>();
		if (files != null) {
			try {
				for (MultipartFile file : files) {
					String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
					String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
					imageUrls.add(fileUrl);
				}
			} catch (IOException e) {
				return ApiResponse.createError(ErrorCode.PRODUCT_CREATION_FAILED);
			}
		}

		productRegistDto.setProductImageUrl(imageUrls);
		productRegistDto.setUserId(users.getUserId());

		productService.createProduct(productRegistDto);

		return ApiResponse.createSuccessWithNoContent("게시물 작성에 성공하였습니다");
	}

	//게시물 정보 가져오기
	@GetMapping("/public/{productId}")
	public ApiResponse<?> getProduct(Authentication authentication, @PathVariable Long productId) {
		ProductDetailDto findProduct;
		Long userId = null;

		// 사용자 인증 정보가 있으면 userId 추출
		if (authentication != null && authentication.isAuthenticated()) {
			Users user = userService.findByEmail(authentication.getName()).orElse(null);
			userId = user != null ? user.getUserId() : null;
		}

		try {
			findProduct = productService.getProductByUserId(productId, userId);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.PRODUCT_NOT_FOUND);
		}

		return ApiResponse.createSuccess(findProduct, "게시물 조회 성공하였습니다.");
	}

	//게시물 수정
	@PutMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ApiResponse<?> updateProduct(
		Authentication authentication,
		@RequestPart(value = "files", required = false) MultipartFile[] files,
		@RequestPart(value = "productUpdateDto") ProductUpdateDto productUpdateDto
	) throws Exception {

		Users user = userService.findByEmail(authentication.getName())
			.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

		Product product = productService.getProductById(productUpdateDto.getProductId())
			.orElseThrow(() -> new Exception("제품 정보를 찾을 수 없습니다."));

		if (!product.getUserId().equals(user.getUserId())) {
			return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
		}

		List<String> imageUrls = new ArrayList<>();
		if (files != null) {
			try {
				for (MultipartFile file : files) {
					String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
					String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
					imageUrls.add(fileUrl);
				}
			} catch (IOException e) {
				return ApiResponse.createError(ErrorCode.PRODUCT_UPDATE_FAILED);
			}
		}
		productUpdateDto.setUserId(user.getUserId());
		productUpdateDto.setProductImageUrl(imageUrls);
		try {
			productService.updateProduct(productUpdateDto.getProductId(), productUpdateDto);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.PRODUCT_UPDATE_FAILED);
		}

		return ApiResponse.createSuccessWithNoContent("게시물 수정에 성공하였습니다");
	}

	//게시물 삭제
	@DeleteMapping()
	public ApiResponse<?> deleteProduct(Authentication authentication, @PathVariable Long productId) throws Exception {

		Users user = userService.findByEmail(authentication.getName())
			.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

		Product product = productService.getProductById(productId)
			.orElseThrow(() -> new Exception("제품 정보를 찾을 수 없습니다."));

		if (!product.getUserId().equals(user.getUserId())) {
			return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
		}

		try {
			productService.deleteProduct(productId);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.PRODUCT_DELETION_FAILED);
		}

		return ApiResponse.createSuccessWithNoContent("게시물 삭제에 성공하였습니다");
	}


	//이미지 삭제
	@DeleteMapping("/image")
	public ApiResponse<?> deleteProduct(@RequestParam Long productImageId, @RequestPart Long productId) {
		try {
			productService.deleteProductImage(productId, productImageId);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.PRODUCT_DELETION_FAILED);
		}

		return ApiResponse.createSuccessWithNoContent("삭제되었습니다");
	}

	// 게시물 조회 - 카테고리, 검색, 지역, 대여&판매, 페이지
	@Transactional(readOnly = true)
	@GetMapping("/public/search")
	public ApiResponse<?> findProductsByDynamicConditions(
		@RequestParam(required = false) String category,
		@RequestParam(required = false) ProductType productType,
		@RequestParam(required = false) Long minPrice,
		@RequestParam(required = false) Long maxPrice,
		@RequestParam(required = false) List<String> locations,
		@RequestParam(required = false) String titleKeyword,
		@RequestParam(required = false) Long findUserId,
		@RequestParam(required = false) Long cursorId,
		@RequestParam(defaultValue = "10") int size,
		Authentication authentication) {

		Long userId = null;
		if (authentication != null && authentication.isAuthenticated()) {
			Users user = userService.findByEmail(authentication.getName()).orElse(null);
			userId = user != null ? user.getUserId() : null;
		}

		Category categoryEnum = null;
		if (category != null) {
			try {
				categoryEnum = Category.valueOf(category);
			} catch (IllegalArgumentException e) {
				return ApiResponse.createError(ErrorCode.INVALID_PRODUCT_CATEGORY);
			}
		}

		try {
			CursorResult<ProductSearchDto> result = productService.findProductsByDynamicConditionsWithCursor(
				categoryEnum, productType, minPrice, maxPrice, locations, titleKeyword, size, userId, findUserId, cursorId);

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("products", result.getContent());
			responseMap.put("nextCursorId", result.getNextCursor());
			responseMap.put("hasNext", result.isHasNext());
			responseMap.put("totalCount", result.getTotalCount());

			return ApiResponse.createSuccess(responseMap, "성공적으로 조회하였습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

}

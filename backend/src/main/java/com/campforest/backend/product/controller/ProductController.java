package com.campforest.backend.product.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.product.dto.ProductDetailDto;
import com.campforest.backend.product.dto.ProductRegistDto;
import com.campforest.backend.product.dto.ProductUpdateDto;
import com.campforest.backend.product.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductController {

	private final ProductService productService;
	private final S3Service s3Service;

	//게시물 작성
	@PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ApiResponse<?> createProduct(
		@RequestPart(value = "files", required = false) MultipartFile[] files,
		@RequestPart(value = "productRegistDto") ProductRegistDto productRegistDto
	) throws IOException {

		List<String> imageUrls = new ArrayList<>();
		for (MultipartFile file : files) {
			String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
			String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
			imageUrls.add(fileUrl);
			log.info("Uploaded file URL: " + fileUrl);
		}

		productRegistDto.setImageUrls(imageUrls);

		productService.createProduct(productRegistDto);

		return ApiResponse.createSuccessWithNoContent("게시물 작성에 성공하였습니다");
	}

	//게시물 정보 가져오기
	@GetMapping
	public ApiResponse<?> getProduct(@RequestParam Long productId) {
		ProductDetailDto findProduct = productService.getProduct(productId);

		return ApiResponse.createSuccess(findProduct, "게시물 조회 성공하였습니다.");
	}

	//게시물 수정
	@PutMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ApiResponse<?> updateProduct(
		@RequestPart(value = "files", required = false) MultipartFile[] files,
		@RequestPart(value = "productUpdateDto") ProductUpdateDto productUpdateDto
	) throws IOException {

		List<String> imageUrls = new ArrayList<>();
		if (files != null) {
			for (MultipartFile file : files) {
				String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
				String fileUrl = s3Service.upload(file.getOriginalFilename(), file, extension);
				imageUrls.add(fileUrl);
			}
		}

		productUpdateDto.setImageUrls(imageUrls);
		productService.updateProduct(productUpdateDto.getProductId(), productUpdateDto);

		return ApiResponse.createSuccessWithNoContent("게시물 수정에 성공하였습니다");
	}

	//게시물 삭제
	@DeleteMapping()
	public ApiResponse<?> deleteProduct(@RequestParam Long productId) {
		productService.deleteProduct(productId);

		return ApiResponse.createSuccessWithNoContent("게시물 삭제에 성공하였습니다");
	}

	//이미지 삭제
	@DeleteMapping("/image")
	public ApiResponse<?> deleteProduct(@RequestParam Long productImageId, @RequestPart Long productId) {
		productService.deleteProductImage(productId, productImageId);

		return ApiResponse.createSuccessWithNoContent("삭제되었습니다");
	}
}
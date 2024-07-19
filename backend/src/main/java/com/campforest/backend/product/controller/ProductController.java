package com.campforest.backend.product.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.config.s3.S3Service;
import com.campforest.backend.product.dto.ProductRegistDto;
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

	@PostMapping(path = "/regist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

}

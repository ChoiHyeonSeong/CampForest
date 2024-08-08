package com.campforest.backend.product.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.CursorResult;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.product.dto.PageResult;
import com.campforest.backend.product.dto.SaveProductDto;
import com.campforest.backend.product.model.Product;
import com.campforest.backend.product.model.SaveProduct;
import com.campforest.backend.product.service.ProductService;
import com.campforest.backend.product.service.SaveProductService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/saveproduct")
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SaveProductController {

	private final SaveProductService saveProductService;

	private final UserService userService;

	@PostMapping()
	public ApiResponse<?> addSave(Authentication authentication, @RequestParam Long productId) throws Exception {
		Users user = userService.findByEmail(authentication.getName())
			.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

		SaveProduct saveProduct = saveProductService.addSave(user.getUserId(), productId);

		if (saveProduct != null) {
			return ApiResponse.createSuccess(saveProduct, "성공적으로 추가하였습니다.");
		} else {
			return ApiResponse.createError(ErrorCode.SAVEPRODUCT_CREATION_FAILED);
		}
	}

	@DeleteMapping()
	public ApiResponse<?> removeSave(Authentication authentication, @RequestParam Long productId) throws Exception {
		Users user = userService.findByEmail(authentication.getName())
			.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

		try {
			saveProductService.deleteProduct(user.getUserId(), productId);
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SAVEPRODUCT_DELETION_FAILED);
		}

		return ApiResponse.createSuccessWithNoContent("게시물 삭제에 성공하였습니다");
	}

	@GetMapping("/list")
	public ApiResponse<?> getSaveList(
		Authentication authentication,
		@RequestParam(required = false) Long cursorId,
		@RequestParam(defaultValue = "20") int size) {
		try {
			Users user = userService.findByEmail(authentication.getName())
				.orElseThrow(() -> new Exception("유저 정보 조회 실패"));

			CursorResult<SaveProductDto> saveProducts = saveProductService.getSaveListWithCursor(user.getUserId(), cursorId, size);
			return ApiResponse.createSuccess(saveProducts, "찜한 장비 게시물 목록 조회에 성공하였습니다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SAVEPRODUCT_NOT_FOUND);
		}
	}
}

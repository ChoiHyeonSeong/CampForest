package com.campforest.backend.product.model;

public enum Category {
	텐트("텐트"),
	의자("의자"),
	침낭("침낭"),
	테이블("테이블"),
	랜턴("랜턴"),
	코펠("코펠"),
	안전용품("안전용품"),
	버너("버너"),
	기타("기타");

	private final String categoryName;

	Category(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getCategoryName() {
		return categoryName;
	}
}

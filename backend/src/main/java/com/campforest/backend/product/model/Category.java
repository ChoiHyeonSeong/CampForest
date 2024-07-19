package com.campforest.backend.product.model;

public enum Category {
	텐트("텐트"),
	의자("의자"),
	침낭_매트("침낭/매트"),
	테이블("테이블"),
	랜턴("랜턴"),
	코펠_식기("코펠/식기"),
	안전용품("안전용품"),
	버너_화로("버너/화로"),
	기타("기타");

	private final String categoryName;

	Category(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getCategoryName() {
		return categoryName;
	}
}

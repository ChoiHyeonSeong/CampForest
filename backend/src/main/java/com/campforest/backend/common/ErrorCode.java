package com.campforest.backend.common;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// Internal Server Error
	INTERNAL_SERVER_ERROR("C001", HttpStatus.INTERNAL_SERVER_ERROR, "서버에 오류가 발생했습니다."),

	// User Error
	USER_REGISTER_FAILED("U001", HttpStatus.BAD_REQUEST, "사용자 등록에 실패했습니다."),
	USER_NOT_FOUND("U002", HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	PASSWORD_NOT_MATCH("U003", HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),
	USER_NOT_AUTHORIZED("U004", HttpStatus.FORBIDDEN, "해당 작업을 수행할 권한이 없습니다."),
	EMAIL_CODE_NOT_MATCH("U005", HttpStatus.BAD_REQUEST, "인증 코드가 일치하지 않습니다."),
	USER_DELETE_FAILED("U006", HttpStatus.BAD_REQUEST, "회원 탈퇴에 실패했습니다."),
	TEMP_USER_NOT_FOUND("U007", HttpStatus.NOT_FOUND, "임시 사용자를 찾을 수 없습니다."),
	OAUTH_CODE_NOT_FOUND("U008", HttpStatus.NOT_FOUND, "OAuth 코드를 찾을 수 없습니다."),
	ALREADY_EXIST_PHONE_NUMBER("U009", HttpStatus.BAD_REQUEST, "이미 존재하는 전화번호입니다."),

	// SMS Error
	SMS_SEND_FAIL("SM001", HttpStatus.BAD_REQUEST, "SMS 전송에 실패했습니다."),
	SMS_CODE_NOT_MATCH("SM002", HttpStatus.BAD_REQUEST, "SMS 인증 코드가 일치하지 않습니다."),

	// Follow Error
	FOLLOW_ALREADY_EXISTS("F001", HttpStatus.BAD_REQUEST, "이미 팔로우한 사용자입니다."),
	FOLLOW_NOT_FOUND("F002", HttpStatus.NOT_FOUND, "팔로우를 찾을 수 없습니다."),
	FOLLOW_FAILED("F003", HttpStatus.BAD_REQUEST, "팔로우에 실패했습니다."),
	UNFOLLOW_FAILED("F004", HttpStatus.BAD_REQUEST, "언팔로우에 실패했습니다."),

	// Unauthorized
	AUTHENTICATION_FAILED("A001", HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
	NO_JWT_TOKEN("A002", HttpStatus.UNAUTHORIZED, "JWT 토큰이 없습니다."),
	INVALID_JWT_TOKEN("A003", HttpStatus.UNAUTHORIZED, "유효하지 않은 JWT 토큰입니다."),
	ACCESS_TOKEN_EXPIRED("A004", HttpStatus.UNAUTHORIZED, "Access Token이 만료되었습니다."),
	REFRESH_TOKEN_EXPIRED("A005", HttpStatus.UNAUTHORIZED, "Refresh Token이 만료되었습니다."),
	REFRESH_TOKEN_BLACKLISTED("A006", HttpStatus.UNAUTHORIZED, "블랙리스트에 등록된 Refresh Token입니다."),
	REFRESH_TOKEN_NOT_FOUND("A007", HttpStatus.UNAUTHORIZED, "Refresh Token을 찾을 수 없습니다."),

	// Product Error
	PRODUCT_CREATION_FAILED("P001", HttpStatus.BAD_REQUEST, "제품 생성에 실패했습니다."),
	PRODUCT_NOT_FOUND("P002", HttpStatus.NOT_FOUND, "제품을 찾을 수 없습니다."),
	PRODUCT_UPDATE_FAILED("P003", HttpStatus.BAD_REQUEST, "제품 업데이트에 실패했습니다."),
	PRODUCT_DELETION_FAILED("P004", HttpStatus.BAD_REQUEST, "제품 삭제에 실패했습니다."),
	INVALID_PRODUCT_CATEGORY("P005", HttpStatus.BAD_REQUEST, "유효하지 않은 제품 카테고리입니다."),
	INVALID_PRODUCT_PRICE("P006", HttpStatus.BAD_REQUEST, "유효하지 않은 제품 가격 범위입니다."),
	INVALID_PRODUCT_TYPE("P007", HttpStatus.BAD_REQUEST, "유효하지 않은 제품 유형입니다."),
	INVALID_PRODUCT_LOCATION("P008", HttpStatus.BAD_REQUEST, "유효하지 않은 제품 위치입니다."),
	INVALID_AUTHORIZED("P009", HttpStatus.BAD_REQUEST, "인증되지 않은 사용자입니다."),

	// SaveProduct Error
	SAVEPRODUCT_CREATION_FAILED("P010", HttpStatus.BAD_REQUEST,  "장비 게시물 찜 생성에 실패했습니다."),
	SAVEPRODUCT_DELETION_FAILED("P011", HttpStatus.BAD_REQUEST, "장비 게시물 찜 삭제에 실패했습니다."),
	SAVEPRODUCT_NOT_FOUND("P012", HttpStatus.BAD_REQUEST, "장비 게시물 찜 목록 불러오기에 실패했습니다"),
	
	// Board Error
	BOARD_NOT_FOUND("B001", HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
	BOARD_CREATION_FAILED("B002", HttpStatus.BAD_REQUEST, "게시글 작성에 실패했습니다."),
	BOARD_UPDATE_FAILED("B003", HttpStatus.BAD_REQUEST, "게시글 수정에 실패했습니다."),
	BOARD_DELETE_FAILED("B004", HttpStatus.BAD_REQUEST, "게시글 삭제에 실패했습니다."),
	INVALID_BOARD_CATEGORY("B005", HttpStatus.BAD_REQUEST, "유효하지 않은 게시글 카테고리입니다."),

	// File Error
	FILE_UPLOAD_FAILED("F001", HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
	INVALID_FILE_FORMAT("F002", HttpStatus.BAD_REQUEST, "유효하지 않은 파일 형식입니다."),
	FILE_DOWNLOAD_FAILED("F003", HttpStatus.INTERNAL_SERVER_ERROR, "파일 다운로드에 실패했습니다"),
	S3_SERVER_ERROR("F004", HttpStatus.INTERNAL_SERVER_ERROR, "S3 서버에 문제가 발생하였습니다"),

	// Like Error
	LIKE_ALREADY_EXISTS("L001", HttpStatus.BAD_REQUEST, "이미 좋아요를 누른 게시글입니다."),
	LIKE_NOT_FOUND("L002", HttpStatus.NOT_FOUND, "좋아요를 찾을 수 없습니다."),

	// Save Error
	SAVE_ALREADY_EXISTS("S001", HttpStatus.BAD_REQUEST, "이미 저장한 게시글입니다."),
	SAVE_NOT_FOUND("S002", HttpStatus.NOT_FOUND, "저장된 게시글을 찾을 수 없습니다."),

	// Comment Error
	COMMENT_NOT_FOUND("C001", HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."),
	COMMENT_CREATION_FAILED("C002", HttpStatus.BAD_REQUEST, "댓글 작성에 실패했습니다."),
	COMMENT_DELETE_FAILED("C003", HttpStatus.BAD_REQUEST, "댓글 삭제에 실패했습니다."),

	// Comment Like Error
	COMMENT_LIKE_ALREADY_EXISTS("CL001", HttpStatus.BAD_REQUEST, "이미 좋아요를 누른 댓글입니다."),
	COMMENT_LIKE_NOT_FOUND("CL002", HttpStatus.NOT_FOUND, "댓글 좋아요를 찾을 수 없습니다."),

	// Pagination Error
	INVALID_PAGE_NUMBER("P001", HttpStatus.BAD_REQUEST, "유효하지 않은 페이지 번호입니다."),
	INVALID_PAGE_SIZE("P002", HttpStatus.BAD_REQUEST, "유효하지 않은 페이지 크기입니다."),

	// Sale Error
	SALE_REQUEST_FAILED("S003", HttpStatus.BAD_REQUEST, "판매 요청에 실패했습니다."),
	SALE_ACCEPT_FAILED("S004", HttpStatus.BAD_REQUEST, "판매 수락에 실패했습니다."),
	SALE_DENY_FAILED("S005", HttpStatus.BAD_REQUEST, "판매 거절에 실패했습니다."),
	SALE_CONFIRM_FAILED("S006", HttpStatus.BAD_REQUEST, "구매 확정에 실패했습니다."),
	SALE_NOT_FOUND("S007", HttpStatus.NOT_FOUND, "판매 정보를 찾을 수 없습니다."),
	SALE_UPDATE_FAILED("S008", HttpStatus.BAD_REQUEST, "판매 업데이트를 할 수 없습니다"),

	// Rent Error
	RENT_REQUEST_FAILED("R001", HttpStatus.BAD_REQUEST, "판매 요청에 실패했습니다."),
	RENT_ACCEPT_FAILED("R002", HttpStatus.BAD_REQUEST, "판매 수락에 실패했습니다."),
	RENT_DENY_FAILED("R003", HttpStatus.BAD_REQUEST, "판매 거절에 실패했습니다."),
	RENT_CONFIRM_FAILED("R004", HttpStatus.BAD_REQUEST, "구매 확정에 실패했습니다."),
	RENT_NOT_FOUND("R005", HttpStatus.NOT_FOUND, "판매 정보를 찾을 수 없습니다."),
	RENT_RESERVED_FAILED("R006", HttpStatus.BAD_REQUEST, "예약된 정보를 가져올 수 없습니다."),

	// Chat Error
	CHAT_ROOM_CREATION_FAILED("CH001", HttpStatus.BAD_REQUEST, "채팅방 생성에 실패했습니다."),
	CHAT_ROOM_NOT_FOUND("CH002", HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."),
	CHAT_MESSAGE_SEND_FAILED("CH003", HttpStatus.BAD_REQUEST, "메시지 전송에 실패했습니다."),
	CHAT_HISTORY_NOT_FOUND("CH004", HttpStatus.NOT_FOUND, "채팅 기록을 찾을 수 없습니다."),
	CHAT_MARK_READ_FAILED("CH005", HttpStatus.BAD_REQUEST, "메시지 읽음 처리에 실패했습니다."),
	CHAT_UNREAD_COUNT_FAILED("CH006", HttpStatus.BAD_REQUEST, "읽지 않은 메시지 수 조회에 실패했습니다."),
	CHAT_ROOM_LIST_FAILED("CH007", HttpStatus.BAD_REQUEST, "채팅방 목록 조회에 실패했습니다."),
	RENT_UPDATE_FAILED("R007", HttpStatus.BAD_REQUEST, "예약 업데이트 불가능합니다."),

	// Review Error
	REVIEW_CREATION_FAILED("R008", HttpStatus.BAD_REQUEST, "리뷰 생성에 실패하였습니다."),
	REVIEW_DELETE_FAILED("R009", HttpStatus.BAD_REQUEST, "리뷰 삭제에 실패하였습니다"),
	REVIEW_READ_FAILED("R010", HttpStatus.BAD_REQUEST, "리뷰를 불러오는 데 실패하였습니다"),

	// Notification Error
	NOTIFICATION_NOT_FOUND("N001", HttpStatus.NOT_FOUND, "알림을 찾을 수 없습니다."),
	;

	private final String code;
	private final HttpStatus httpStatus;
	private final String message;
}

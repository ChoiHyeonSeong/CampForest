package com.campforest.backend.transaction.model;

public enum TransactionStatus {

	REQUESTED, //렌트, 판매 요청
	RESERVED,  //렌트, 판매 수락 후 예약 -> 렌트 or 판매 데이터 생성 및 거래 확정이 생겨야함
	RECEIVED, //렌트, 판매 요청 수신
	CONFIRMED, //렌트, 판매 거래 확정
	DENIED
}

# CampForest

![image.png](./docs/images/image01.png)

***CampForest***는 캠핑을 사랑하는 모든 이들을 위한 플랫폼입니다. 저렴한 장비 대여, 장비를 통한 재테크, 캠핑장에 대한 신뢰성 있는 정보 제공, 그리고 캠퍼들 간의 활발한 정보 교류를 통해 더 즐겁고 경제적인 캠핑 문화를 즐겨보세요!

# ERD

![image.png](./docs/images/image02.png)

### 도식화

![image.png](./docs/images/image03.png)

# System Architecture

![image.png](./docs/images/image04.png)

# Sequence Diagram

## 장비 게시글 작성

```mermaid
sequenceDiagram
    actor User
    participant Client
    participant Server
    participant Database

    Note over User,Database: 장비 게시물 CRUD 작업

    User->>Client: 장비 게시물 작성 요청
    Client->>Server: POST /product
    Server->>Database: INSERT 게시물 데이터
    Database-->>Server: 삽입 결과
    Server-->>Client: 작성 성공 응답
    Client-->>User: 작성 완료 표시

    User->>Client: 장비 게시물 수정 요청
    Client->>Server: PUT /product/{id}
    Server->>Database: UPDATE 게시물 데이터
    Database-->>Server: 수정 결과
    Server-->>Client: 수정 성공 응답
    Client-->>User: 수정 완료 표시

    User->>Client: 장비 게시물 삭제 요청
    Client->>Server: DELETE /product/{id}
    Server->>Database: DELETE 게시물 데이터
    Database-->>Server: 삭제 결과
    Server-->>Client: 삭제 성공 응답
    Client-->>User: 삭제 완료 표시

    User->>Client: 장비 게시물 조회 요청
    Client->>Server: GET /product/{id}
    Server->>Database: SELECT 게시물 데이터
    Database-->>Server: 조회 결과
    Server-->>Client: 게시물 정보 응답
    Client-->>User: 게시물 정보 표시

    Note over User,Database: 동적 쿼리 검색

    User->>Client: 동적 검색 요청
    Client->>Server: GET /product/search
    Note right of Client: 쿼리 파라미터: 카테고리, 검색어, 지역, 대여/판매, 페이지
    Server->>Database: 동적 쿼리 실행
    Database-->>Server: 검색 결과
    Server-->>Client: 검색 결과 응답
    Client-->>User: 검색 결과 표시
```

## 사용자 장비 거래

```mermaid
sequenceDiagram
    participant 구매자
    participant 채팅방
    participant 판매자
    participant 거래시스템

    구매자->>채팅방: 채팅방 생성 요청
    채팅방->>판매자: 채팅방 생성 알림
    
    alt 구매자가 거래 요청
        구매자->>거래시스템: 거래 요청
        거래시스템->>판매자: 거래 요청 전달
    else 판매자가 거래 요청
        판매자->>거래시스템: 거래 요청
        거래시스템->>구매자: 거래 요청 전달
    end

    alt 거래 요청 수락
        판매자->>거래시스템: 거래 요청 수락
        거래시스템->>구매자: 예약 성사 알림
        거래시스템->>판매자: 예약 성사 알림
    else 거래 요청 거절
        판매자->>거래시스템: 거래 요청 거절
        거래시스템->>구매자: 거래 거절 알림
    end

    구매자->>거래시스템: 거래 확정
    판매자->>거래시스템: 거래 확정
    
    alt 양쪽 모두 거래 확정
        거래시스템->>구매자: 후기 작성 활성화
        거래시스템->>판매자: 후기 작성 활성화
    end

    alt 구매자가 채팅방 나가기
        구매자->>채팅방: 채팅방 나가기 요청
        채팅방->>구매자: 이전 대화 숨김 처리
        채팅방->>판매자: 채팅 내역 유지
    else 판매자가 채팅방 나가기
        판매자->>채팅방: 채팅방 나가기 요청
        채팅방->>판매자: 이전 대화 숨김 처리
        채팅방->>구매자: 채팅 내역 유지
    end
```

# 주요 기능

## 🗣️ 커뮤니티

### 1. 피드

> 장비 후기, 레시피 추천, 캠핑장 양도, 자유게시판, 질문 게시판 카테고리 별로 원하는 피드를 작성하고 사람들과 소통할 수 있어요!
> 

### 2. 팔로우/팔로잉

> 원하는 사용자를 팔로우하고 주기적으로 게시글을 확인할 수 있어요!
> 

### 3. 채팅

> 다양한 사람들과 직접 채팅을 통해 정보를 공유할 수 있어요!
> 

## ⛺️ 장비 대여/거래

### 1. 장비 대여

> 캠핑 한 번을 위해 캠핑 장비를 구입하기 부담되지 않나요? 혹은, 집에 방치되어 있는 캠핑 장비를 효율적으로 활용하고 싶으신가요? 원하는 캠핑 장비를 찾아보고 대여해보세요!
> 

### 2. 장비 판매

> 이제는 필요 없어진 나의 캠핑 장비를 판매해보세요!
> 

## 🔎 캠핑장 검색&후기

### 1. 캠핑장 검색

> 주변 시설, 반려동물 동반 여부 등 원하는 조건과 함께 나에게 맞는 최적의 캠핑장을 검색해보세요!
> 

### 2. 캠핑장 후기

> 방문했던 캠핑장에 대한 후기를 남기고, 가고 싶은 캠핑장의 후기를 미리 확인해보세요!
>
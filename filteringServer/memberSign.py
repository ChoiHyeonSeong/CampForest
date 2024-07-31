import json

import requests
import random
from faker import Faker

# Faker 인스턴스 생성
fake = Faker('ko_KR')

interests_options = [
    "산", "해변", "강가", "숲", "도심 근교", "계곡", "섬", "수도권", "경기도", "강원도",
    "충청도", "전라도", "경상도", "제주도", "가족", "연인", "혼자", "친구", "반려동물",
    "오토캠핑", "백패킹", "모토캠핑", "미니멀캠핑", "차박캠핑", "글램핑", "카라반",
    "노지캠핑", "캠프닉", "비박", "요리", "자연", "사진", "술", "휴식", "별",
    "불멍", "수상 스포츠", "암벽 등반", "음악"
]

# 사용자 정보 생성
def generate_user(index):
    return {
        "userName": fake.name(),
        "email": f"user{index}@test.com",
        "password": "12345",
        "role": "ROLE_USER",
        "provider": "local",
        "providerId": None,
        "birthdate": fake.date_of_birth(minimum_age=18, maximum_age=60).strftime('%Y-%m-%d'),
        "gender": random.choice(["M", "F"]),
        "isOpen": random.choice([True, False]),
        "nickname": fake.user_name(),
        "phoneNumber": fake.phone_number(),
        "introduction": fake.sentence(nb_words=10),
        "interests": random.sample(interests_options, 6)
    }

# 4개의 사용자 정보 생성
users = [generate_user(i) for i in range(1, 1001)]

# 서버로 요청 전송
url = "http://192.168.100.167:8080/user/auth/regist"

for user in users:
    # multipart/form-data 형식으로 데이터 준비
    files = {
        'profileImage': (None, None),  # 이미지 없음
        'registUserDto': ('registUserDto', json.dumps(user), 'application/json')  # JSON 문자열로 변환
    }

    response = requests.post(url, files=files)

    if response.status_code == 200:
        print(f"User {user['userName']} registered successfully")
    else:
        print(f"Failed to register user {user['userName']}: {response.status_code}")
        print(f"Error message: {response.text}")
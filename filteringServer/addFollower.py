import mysql.connector
import random

# DB 연결 설정
conn = mysql.connector.connect(
    host='3.36.78.37',
    user='root',
    password='11d208campforest!',
    database='campforest'
)


# 938명의 사용자 ID 리스트 (예시로 1부터 938까지)
user_ids = list(range(1, 931))

# 팔로우할 사용자 수 범위 설정
MIN_FOLLOW = 100
MAX_FOLLOW = 150

# 팔로우 관계를 DB에 삽입하는 함수
def insert_follow_relationships(conn, user_ids):
    cursor = conn.cursor()
    follow_relationships = []

    for follower_id in user_ids:
        # 팔로우할 사용자 수 랜덤 설정
        num_followees = random.randint(MIN_FOLLOW, MAX_FOLLOW)
        # 팔로우할 사용자 무작위 선택 (자기 자신 제외)
        followees = random.sample([uid for uid in user_ids if uid != follower_id], num_followees)

        for followee_id in followees:
            follow_relationships.append((follower_id, followee_id))

    # 팔로우 관계를 DB에 삽입
    insert_query = """
    INSERT INTO follow (follower_id, followee_id, created_at) VALUES (%s, %s, NOW())
    """
    cursor.executemany(insert_query, follow_relationships)
    conn.commit()
    cursor.close()

# 팔로우 실행
if __name__ == "__main__":
    insert_follow_relationships(conn, user_ids)
    conn.close()

from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

try:
    # SQLAlchemy를 사용하여 MySQL 데이터베이스 연결 설정
    engine = create_engine('mysql+mysqlconnector://root:11d208campforest!@3.36.78.37/campforest')

    # 사용자 관심사 데이터 로드
    user_interest = pd.read_sql("SELECT * FROM user_interest", engine)

    # 사용자 관심사 데이터 정보 출력
    print("User interest data shape:", user_interest.shape)
    print("User interest data sample:")
    print(user_interest.head())

    # 사용자-아이템 행렬 생성
    user_interest_matrix = pd.pivot_table(user_interest, index='user_id', columns='interest_id', aggfunc='size', fill_value=0)

    # 사용자-아이템 행렬 정보 출력
    print("User-item matrix shape:", user_interest_matrix.shape)
    print("User-item matrix sample:")
    print(user_interest_matrix.head())

    # 사용자 간 유사도 계산
    user_similarity = cosine_similarity(user_interest_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_interest_matrix.index, columns=user_interest_matrix.index)

    # 유사도 행렬 정보 출력
    print("User similarity matrix shape:", user_similarity_df.shape)
    print("User similarity matrix sample:")
    print(user_similarity_df.head())

    # 특정 사용자에 대한 추천 생성 함수
    def recommend_interests(user_id, user_similarity_df, user_interest_matrix, top_n=5):
        if user_id not in user_similarity_df.index:
            print(f"User ID {user_id} not found in the data.")
            return []

        # 유사한 사용자 찾기 (자기 자신과 유사도가 0인 사용자 제외)
        similar_users = user_similarity_df[user_id].sort_values(ascending=False)
        similar_users = similar_users[(similar_users.index != user_id)]

        if similar_users.empty:
            print(f"No similar users found for user {user_id}")
            return []

        # 유사한 사용자의 관심사 가져오기
        similar_users_interests = user_interest_matrix.loc[similar_users.index]

        # 관심사 점수 계산 (유사도를 가중치로 사용)
        interest_scores = (similar_users_interests.T * similar_users).T.sum(axis=0)

        # 사용자가 이미 관심을 가진 항목 제거
        interest_scores = interest_scores.drop(user_interest_matrix.columns[user_interest_matrix.loc[user_id] > 0])

        # 상위 N개의 관심사 추천
        top_interests = interest_scores.sort_values(ascending=False).head(top_n)
        return top_interests.index.tolist(), top_interests.tolist()

    # 사용자 ID가 20인 사용자의 비슷한 친구 찾기
    user_id = 20
    if user_id in user_similarity_df.index:
        similar_users = user_similarity_df[user_id].sort_values(ascending=False).index[1:]  # 자기 자신 제외
        top_similar_users = similar_users[:5]
        print(f"Top 5 similar users to user {user_id} with similarity scores:")
        for similar_user in top_similar_users:
            print(f"User ID: {similar_user}, Similarity: {user_similarity_df.loc[user_id, similar_user]}")
    else:
        print(f"User ID {user_id} not found in the data.")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # 연결 닫기 (SQLAlchemy는 자동으로 연결 관리를 수행합니다)
    print("Process completed.")

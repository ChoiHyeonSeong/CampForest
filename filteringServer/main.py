from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# SQLAlchemy를 사용하여 MySQL 데이터베이스 연결 설정
engine = create_engine('mysql+mysqlconnector://root:11d208campforest!@3.36.78.37/campforest')

# 데이터 로드 및 유사도 계산 함수
def load_data_and_calculate_similarity():
    user_interest = pd.read_sql("SELECT * FROM user_interest", engine)
    user_interest_matrix = pd.pivot_table(user_interest, index='user_id', columns='interest_id', aggfunc='size', fill_value=0)
    user_similarity = cosine_similarity(user_interest_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_interest_matrix.index, columns=user_interest_matrix.index)
    return user_similarity_df

user_similarity_df = load_data_and_calculate_similarity()

# 유사한 사용자 추천 함수
def get_similar_users(user_id: int, user_similarity_df, top_n=5):
    if user_id not in user_similarity_df.index:
        raise HTTPException(status_code=404, detail=f"User ID {user_id} not found in the data.")

    similar_users = user_similarity_df[user_id].sort_values(ascending=False).index[1:]  # 자기 자신 제외
    top_similar_users = similar_users[:top_n]
    return top_similar_users.tolist()

@app.get("/similar-users/{user_id}")
async def similar_users(user_id: int):
    try:
        similar_users = get_similar_users(user_id, user_similarity_df)
        return {"user_id": user_id, "similar_users": similar_users}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# FastAPI 애플리케이션 실행 (uvicorn 사용)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

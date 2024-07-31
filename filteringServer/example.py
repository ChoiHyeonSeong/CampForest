import mysql.connector

try:
    # MySQL 데이터베이스 연결 설정
    connection = mysql.connector.connect(
        host='3.36.78.37',
        user='root',
        password='11d208campforest!',
        database='campforest'
    )

    if connection.is_connected():
        print("Successfully connected to the database")

        # 커서 생성
        cursor = connection.cursor()

        # SQL 쿼리 실행
        cursor.execute("SELECT * FROM users")

        # 결과 가져오기
        result = cursor.fetchall()

        # 결과 출력
        for row in result:
            print(row)

except mysql.connector.Error as err:
    print(f"Error: {err}")

finally:
    # 커서 및 연결 닫기
    if connection.is_connected():
        cursor.close()
        connection.close()
        print("MySQL connection is closed")

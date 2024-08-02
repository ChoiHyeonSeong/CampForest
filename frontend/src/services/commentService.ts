import axios from 'axios';
import axiosInstance from './authService';

const API_URL = 'http://i11d208.p.ssafy.io/api';

export const commentList = async (boardId: number) => {
  const params = { boardId: boardId };
  const response = await axiosInstance.get(`board/comment`, {params});

  console.log(response);
  return response.data.data.content;
}

export const commentWrite = async (boardId: number, content: string) => {
  const response = await axiosInstance.post(`/board/comment`,
    {
      boardId: boardId,
      content: content
    }
  )

  console.log(response);
}
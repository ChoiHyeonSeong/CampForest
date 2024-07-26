import axios from 'axios';
import axiosInstance from './authService';

const API_URL = 'http://192.168.100.203:8080';

export const write = async (userId: number, title: string, content: string, category: string, boardOpen: boolean) => {
  const formData = new FormData();
  const value = {
    userId: userId,
    title: title,
    content: content,
    category: category,
    boardOpen: boardOpen
  }
  const blob = new Blob([JSON.stringify(value)], {type: "application/json"})
  formData.append('boardRequestDto', blob);
  
  try {
    console.log('write', axiosInstance.defaults.headers['Authorization'] );
    const response = await axiosInstance.post(`/board`, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    console.log(response);
    console.log('Board Write successful');
  } catch (error) {
    console.error('Board Write failed:', error);
    throw error;
  }
}

export const list = (page: number, size: number) => {
  const params = { page: page, size: size };
  
  const response = axios.get(`${API_URL}/board`, {params});
  return response;
  
}

export const detail = (boardId: number) => {
  const params = { boardId: boardId };

  const response = axios.get(`${API_URL}/board/detail`, {params});
  console.log(response);
}

export const like = (boardId: number, userId: number) => {
  const response = axios.post(`${API_URL}/board/like?boardId=${boardId}&userId=${userId}`);
  console.log(response);
}
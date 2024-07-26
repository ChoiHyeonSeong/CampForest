import axios from 'axios';
import axiosInstance from './authService';

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
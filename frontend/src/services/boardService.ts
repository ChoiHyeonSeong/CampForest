import axios from 'axios';
import axiosInstance from './authService';

export const write = async (userId: number, title: string, content: string, category: string, boardOpen: boolean) => {
  try {
    console.log('write', axiosInstance.defaults.headers['Authorization'] );
    await axiosInstance.post(`/board`, {
      userId: userId, title: title, content: content, category: category, boardOpen: boardOpen});
    console.log('Board Write successful');
  } catch (error) {
    console.error('Board Write failed:', error);
    throw error;
  }
}
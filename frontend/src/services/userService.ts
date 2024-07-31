import axios from 'axios'
import axiosInstance from './authService';

const API_URL = 'http://192.168.100.167:8080';

export const userPage = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  console.log(response);

  return response.data.data;
}

export const deleteUser = async () => {
  const response = await axiosInstance.delete('/user');
  console.log(response);
}
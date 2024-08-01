import axios from 'axios'
import axiosInstance from './authService';

const API_URL = 'http://3.36.78.37:8081';

export const userPage = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/auth/info`, {params: {userId: userId}});
  console.log(response);  

  return response.data.data;
}

export const deleteUser = async () => {
  const response = await axiosInstance.delete('/user');
  console.log(response);
}

export const followerList = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/auth/follower/${userId}`);

  return response.data.data;
}

export const followingList = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/auth/following/${userId}`);

  return response.data.data;
}
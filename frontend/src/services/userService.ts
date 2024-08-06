import axios from 'axios'
import axiosInstance from './authService';

export const userPage = async (userId: number) => {
  const response = await axios.get(`/user/auth/info`, {params: {userId: userId}});
  // console.log(response);  

  return response.data.data;
}

export const deleteUser = async () => {
  const response = await axiosInstance.delete('/user');
  console.log(response);
}

export const followerList = async (userId: number) => {
  const response = await axios.get(`/user/auth/follower/${userId}`);

  return response.data.data;
}

export const followingList = async (userId: number) => {
  const response = await axios.get(`/user/auth/following/${userId}`);

  return response.data.data;
}
export const nicknameSearch = async (key:string) => {
  const response = await axios.get(`/user/auth/search?nickname=${key}`,);

  console.log(response.data);
  return (response.data.data);
}

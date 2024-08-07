import axios from 'axios'
import axiosInstance from './authService';

export const userPage = async (userId: number) => {
  const response = await axios.get(`/user/public/info`, {params: {userId: userId}});
  // console.log(response);  

  return response.data.data;
}

export const deleteUser = async () => {
  const response = await axiosInstance.delete('/user');
  console.log(response);
}

export const followerList = async (userId: number) => {
  const response = await axios.get(`/user/public/follower/${userId}`);

  return response.data.data;
}

export const followingList = async (userId: number) => {
  const response = await axios.get(`/user/public/following/${userId}`);

  return response.data.data;
}
export const nicknameSearch = async (nickname: string) => {
  const response = await axios.get(`/user/public/search?nickname=${nickname}`,);

  console.log(response.data);
  return (response.data.data);
}

export const userFollow = async (userId: number) => {
  const response = await axiosInstance.post(`/user/follow/${userId}`);

  return response;
}

export const userUnfollow = async (userId: number) => {
  const response = await axiosInstance.post(`/user/unfollow/${userId}`);

  return response;
}
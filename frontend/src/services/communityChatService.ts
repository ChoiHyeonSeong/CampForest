import axiosInstance from '@services/authService'

export const communityChatList = async (userId: number) => {
  const params = { userId: userId };
  const response = await axiosInstance.get(`/communitychat/rooms`, { params: params });

  console.log(response);
  return response.data.data;
}

export const communityChatDetail = async (roomId: number) => {
  const response = await axiosInstance.get(`/communitychat/room/${roomId}/messages`);

  console.log(response);
}
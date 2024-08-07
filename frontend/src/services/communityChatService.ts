import axiosInstance from '@services/authService'

export const communityChatList = async (userId: number) => {
  
  try {
    const params = { userId: userId };
    const response = await axiosInstance.get(`/communitychat/rooms`, { params: params });

    console.log(response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
  
}

export const communityChatDetail = async (roomId: number) => {
  try {
    const response = await axiosInstance.get(`/communitychat/room/${roomId}/messages`);

    console.log(response);
    return response.data.data;
  } catch (err) {
    throw err;
  }  
}

export const initCommunityChat = async (userId: number): Promise<number> => {
  const response = await axiosInstance.post(`/communitychat/room`, userId, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  return response.data.data.roomId;
}

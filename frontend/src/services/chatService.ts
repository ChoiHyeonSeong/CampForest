import axiosInstance from '@services/authService';

export const communityChatList = async () => {
  try {
    const response = await axiosInstance.get(`/communitychat/rooms`);

    console.log(response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const communityChatDetail = async (roomId: number) => {
  try {
    const response = await axiosInstance.get(`/communitychat/room/${roomId}/messages`);

    console.log(response);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const initCommunityChat = async (userId: number): Promise<number> => {
  const response = await axiosInstance.post(`/communitychat/room`, userId, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data.data.roomId;
};

export const exitCommunityChat = async (roomId: number) => {
  try {
  const response = await axiosInstance.post(`/communitychat/room/${roomId}/exit`);
  console.log(response);
  } catch (error) {
    throw error
  }
}

export const transactionChatList = async () => {
  const response = await axiosInstance.get(`/transactionchat/rooms`);

  console.log(response);
  return response.data.data;
};

export const transactionChatDetail = async (roomId: number) => {
  console.log(roomId);
  const response = await axiosInstance.get(`/transactionchat/room/${roomId}/messages`);

  console.log(response.data);
  return response.data.data;
};

export const initTransactionChat = async (productId: number, userId: number): Promise<number> => {
  const response = await axiosInstance.post(
    `/transactionchat/room`,
    { productId: productId, seller: userId },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('initTransactionChat', response);
  return response.data.data.roomId;
};

export const checkRentable = async (productId: number) => {
  try {
    let dateString = '';
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() < 10 ? ('0' + currentDate.getMonth()) : currentDate.getMonth();
    let day = currentDate.getDay() < 10 ? ('0' + currentDate.getDay()) : currentDate.getDay();
    dateString = year + '-' + month + '-' + day;

    const params = { productId: productId, currentDate: dateString }
    const response = await axiosInstance.get(`rent/public/rentable`, { params });
    console.log(response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
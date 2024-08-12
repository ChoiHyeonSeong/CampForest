import axiosInstance from "./authService";

export const getNotificationList = async () => {
  const response = await axiosInstance.get(`/notification/all`);

  // console.log(response);
  return response.data.data;
}

export const readNotification = async () => {
  const response = await axiosInstance.post(`/notification/readAll`);

  console.log(response);
}
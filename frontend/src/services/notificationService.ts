import axiosInstance from "./authService";

export const getNotificationList = async () => {
  const response = await axiosInstance.get(`/notification/all`);

  console.log(response);
  return response.data.data;
}
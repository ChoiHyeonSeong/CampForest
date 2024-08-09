import axiosInstance from "./authService";

export const notificationList = async () => {
  const response = await axiosInstance.get(`/notification/all`);

  console.log(response);
}
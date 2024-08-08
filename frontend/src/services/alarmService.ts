import axiosInstance from "./authService";

export const alarmList = async () => {
  const response = await axiosInstance.get(`/notification/all`);

  console.log(response);
}
import axiosInstance from "./authService";


export const subscribeRequest = async () => {
  const response = await axiosInstance.get(`notification/subscribe`);

  console.log(response);
}
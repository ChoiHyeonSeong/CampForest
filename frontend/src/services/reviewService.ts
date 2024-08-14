import axiosInstance from "./authService";

export const reviewWrite = async (reviewedId: number, content: string, rating: number, productType: string, roomId: number, images: File[]) => {
  const formData = new FormData();
  const value = {
    reviewedId: reviewedId,
    content: content,
    rating: rating,
    productType: productType,
    roomId: roomId
  }
  const blob = new Blob([JSON.stringify(value)], { type: "application/json" })
  formData.append('reviewRequestDto', blob);
  
  images.forEach((file, index) => {
    formData.append(`files`, file);
  });

  try {
    const response = await axiosInstance.post(`/review`, formData);
    console.log('review Write success: ', response);
  } catch (error) {
    console.error('review Write failed: ', error);
  }

}

export const userReviewList = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/review/received?userId=${userId}`);
    console.log('userReviewList success :', response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const writeReviewList = async () => {
  try {
    const response = await axiosInstance.get(`/review/written`);
    console.log('writeReviewList success: ', response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
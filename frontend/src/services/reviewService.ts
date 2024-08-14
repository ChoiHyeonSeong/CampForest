import axiosInstance from "./authService";

export const reviewWrite = async (reviewedId: number, content: string, rating: number, productType: string, images: File[]) => {
  const formData = new FormData();
  const value = {
    reviewedId: reviewedId,
    content: content,
    rating: rating,
    productType: productType
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
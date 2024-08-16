import axiosInstance from './authService';

export const campingLoadRating = (campsiteIds: number[]) => {
  const body = { campsiteIds };
  const response = axiosInstance.post(`/campsite/public/rate`, body);

  return response;
};

export const campingLoadReviews = (campsiteId: number) => {
  const params = { campsiteId };

  const response = axiosInstance.get(`/campsite/public/review`, { params });
  return response;
};

export const campingReviewWrite = (campsiteId: number, content: string, rate: number) => {
  const body = { campsiteId, content, rate };

  const response = axiosInstance.post(`/campsite`, body);
  return response;
};

export const campingReviewDelete = (reviewId: number) => {
  const params = { reviewId };

  const response = axiosInstance.delete(`/campsite`, { params });
  return response;
};

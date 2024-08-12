import axios from 'axios';
import axiosInstance from './authService';

type ProductRegistDto = {
  productName: string,
  productPrice: number | undefined,
  productContent: string,
  location: string,
  productType: string,
  category: string,
  deposit: number | undefined
}

type SearchParams = {
  category?: string | null,
  findUserId?: number,
  productType: string,
  minPrice?: number | null,
  maxPrice?: number | null,
  locations?: string[],
  titleKeyword?: string,
  cursorId?: number | null,
  size?: number,
  userId?: number,
}

export const productWrite = async (productRegistDto: ProductRegistDto, productImages: File[]) => {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(productRegistDto)], {type: 'application/json'});
  formData.append('productRegistDto', blob);

  productImages.forEach((file, index) => {
    formData.append(`files`, file);
  });

  try {
    const response = await axiosInstance.post('/product', formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    console.log(response);
  } catch (error) {
    throw error;
  }
}

export const productList = async (searchParams: SearchParams) => {
  const response = await axiosInstance.get(`/product/public/search`, { params: searchParams});
  console.log(response.data.data)
  return response.data.data;
}

export const productDetail = async (productId: number) => {
  const response = await axiosInstance.get(`/product/public/${productId}`);
  return response.data.data;
}

type LikedParams = {
  cursorId?: number | null,
  size?: number
}

export const productLike = async (productId: number) => {
  const params = { productId: productId }
  const response = await axiosInstance.post(`/saveproduct`, null, { params: params });
  console.log('product Like', response);
  return response
}

export const productDislike = async (productId: number) => {
  const params = { productId: productId }
  const response = await axiosInstance.delete(`/saveproduct`, { params: params });
  console.log('product Like', response);
  return response
}

export const likedList = async (likedParams: LikedParams) => {
  const response = await axiosInstance.get(`/saveproduct/list`, { params: likedParams });
  console.log('관심', response);
  return response.data.data
}
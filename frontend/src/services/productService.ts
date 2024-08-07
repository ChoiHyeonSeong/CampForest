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
  category?: string,
  findUserId?: number,
  productType: string,
  minPrice?: number,
  maxPrice?: number,
  locations?: {},
  titleKeyword?: string,
  page?: number,
  size?: number
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

  return response.data.data;
}

export const productDetail = async (productId: number) => {
  const response = await axios.get(`/product/public/${productId}`);
  return response.data.data;
}

export const likedList = async () => {
  const response = await axiosInstance.get(`/saveproduct/list`);
  console.log(response.data.data);
  return response.data.data
}
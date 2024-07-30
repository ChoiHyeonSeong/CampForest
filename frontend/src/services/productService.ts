import axios from 'axios';
import axiosInstance from './authService';

const API_URL = 'http://192.168.100.167:8080';

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
  productType: string,
  minPrice?: number,
  maxPrice?: number,
  locations?: {},
  titleKeyword?: string,
  page?: number,
  size?: number
}

export const write = async (productRegistDto: ProductRegistDto, productImages: File[]) => {
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
    console.error('Product Write failed:', error);
    throw error;
  }
}

export const list = async (searchParams: SearchParams) => {
  const response = await axios.get(`${API_URL}/product/search`, { params: searchParams});
  console.log(response.data.data.content);
}
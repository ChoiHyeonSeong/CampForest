import axios from 'axios';
import axiosInstance from './authService';

const API_URL = 'http://192.168.100.203:8080';

type ProductRegistDto = {
  productName: string,
  productPrice: number,
  productContent: string,
  location: string,
  productType: string,
  category: string,
  productImageUrl: {}
}

export const write = async (productRegistDto: ProductRegistDto) => {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(productRegistDto)], {type: 'application/json'});
  formData.append('productRegistDto', blob);

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
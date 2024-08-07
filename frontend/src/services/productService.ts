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
  userId?: number,
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
  console.log("API Response:", response.data);
  return response.data.data;
}

// export const productList = async (searchParams: SearchParams) => {
//   try {
//     const response = await axiosInstance.get(`/product/public/search`, { params: searchParams });
//     console.log("API Response:", response.data);
//     return response.data; // .data 제거, API 응답 구조에 따라 조정
//   } catch (error) {
//     console.error("Error fetching product list:", error);
//     throw error; // 에러를 던져서 호출하는 쪽에서 처리할 수 있게 함
//   }
// }

export const productDetail = async (productId: number) => {
  const response = await axios.get(`/product/public/${productId}`);
  return response.data.data;
}

// export const productSearch = async ( searchParams: SearchParams ) => {
//   const params = { titleKeyword: searchParams.titleKeyword };
//   const response = await axiosInstance.get(`/product/public/search`, { params: params });

//   console.log(response.data.data);
//   return response.data.data;
// }
import axios from 'axios';
import axiosInstance from './authService';

export const boardWrite = async (userId: number, title: string, content: string, category: string, boardOpen: boolean, images: File[]) => {
  const formData = new FormData();
  const value = {
    userId: userId,
    title: title,
    content: content,
    category: category,
    boardOpen: boardOpen
  }
  const blob = new Blob([JSON.stringify(value)], {type: "application/json"})
  formData.append('boardRequestDto', blob);

  images.forEach((file, index) => {
    formData.append(`files`, file);
  });

  try {
    console.log('write', axiosInstance.defaults.headers['Authorization'] );
    const response = await axiosInstance.post(`/board`, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    console.log(response);
    console.log('Board Write successful');
  } catch (error) {
    console.error('Board Write failed:', error);
    throw error;
  }
}

export const boardList = (page: number, size: number) => {
  const params = { page: page, size: size };
  
  const response = axiosInstance.get(`/board/public`, {params});
  return response;
}

export const boardUserList = async (userId: number, page?: number, size?: number) => {
  const params = { userId: userId, page: page, size: size };

  const response = await axios.get(`/board/public/user`, {params});

  return response;
}

export const filteredBoardList = (category: string, page: number, size: number) => {
  const params = { category: category, page: page, size: size };
  
  const response = axios.get(`/board/public/category`, {params});
  return response;
}

export const boardDetail = (boardId: number) => {
  const params = { boardId: boardId };

  const response = axiosInstance.get(`/board/public/detail`, {params});
  return response;
}

export const boardDelete = async (boardId: number) => {
  const params = { boardId: boardId };

  const response = await axiosInstance.delete(`/board`, {params});
  return response;
}

export const boardLike = async (boardId: number, userId: number) => {
  const response = await axiosInstance.post(`/board/like?boardId=${boardId}&userId=${userId}`);
  console.log(response);

  return response.data.data;
}

export const boardDislike = async (boardId: number, userId: number) => {
  const response = await axiosInstance.delete(`/board/like?boardId=${boardId}&userId=${userId}`);
  console.log(response);

  return response.data.data;
}

export const boardTitleSearch = async (title: string, page?: number, size?: number) => {
  const params = { title: title, page: page, size: size };
  const response = await axiosInstance.get(`/board/public/title`, { params: params });

  // console.log(response.data.data.content);
  return (response.data.data.content);
}
import axiosInstance from './authService';

export const boardWrite = async (
  userId: number,
  title: string,
  content: string,
  category: string,
  boardOpen: boolean,
  images: File[],
) => {
  const formData = new FormData();
  const value = {
    userId: userId,
    title: title,
    content: content,
    category: category,
    boardOpen: boardOpen,
  };
  const blob = new Blob([JSON.stringify(value)], { type: 'application/json' });
  formData.append('boardRequestDto', blob);

  images.forEach((file, index) => {
    formData.append(`files`, file);
  });

  try {
    console.log('write', axiosInstance.defaults.headers['Authorization']);
    const response = await axiosInstance.post(`/board`, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    console.log(response);
    console.log('Board Write successful');

    return response;
  } catch (error) {
    console.error('Board Write failed:', error);
    throw error;
  }
};

export const boardList = (cursorId: number | null, size: number) => {
  const params = { cursorId: cursorId, size: size };

  const response = axiosInstance.get(`/board/public`, { params });
  return response;
};

export const mixedBoardList = async (userIds: number[], cursorId: number | null, size: number) => {
  const params = { userIds: userIds.join(','), cursorId, size };
  try {
    const response = await axiosInstance.get(`/board/mixed`, { params });
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const boardUserList = async (userId: number, cursorId: number | null, size: number) => {
  const params = { userId: userId, cursorId: cursorId, size: size };

  const response = await axiosInstance.get(`/board/public/user`, { params });

  return response;
};

export const filteredBoardList = (category: string, cursorId: number | null, size: number) => {
  const params = { category: category, cursorId: cursorId, size: size };

  const response = axiosInstance.get(`/board/public/category`, { params });
  return response;
};

export const boardDetail = (boardId: number) => {
  const params = { boardId: boardId };

  const response = axiosInstance.get(`/board/public/detail`, { params });
  return response;
};

export const boardDelete = async (boardId: number) => {
  const params = { boardId: boardId };

  const response = await axiosInstance.delete(`/board`, { params });
  return response;
};

export const boardLike = async (boardId: number, userId: number) => {
  const response = await axiosInstance.post(`/board/like?boardId=${boardId}&userId=${userId}`);

  return response.data.data;
};

export const boardDislike = async (boardId: number, userId: number) => {
  const response = await axiosInstance.delete(`/board/like?boardId=${boardId}&userId=${userId}`);
  console.log(response);

  return response.data.data;
};

export const boardTitleSearch = async (keyword: string, cursorId: number | null, size: number) => {
  const params = { keyword, cursorId, size };
  const response = await axiosInstance.get(`/board/public/keyword`, { params: params });

  console.log(response);
  return response.data.data;
};

export const boardSave = async (boardId: number) => {
  const response = await axiosInstance.post(`/board/save?boardId=${boardId}`);

  console.log(response);
};

export const deleteSave = async (boardId: number) => {
  const response = await axiosInstance.delete(`/board/save?boardId=${boardId}`);

  console.log(response);
};

export const savedList = async (cursorId: number | null, size: number) => {
  const params = { cursorId: cursorId, size: size };
  const response = await axiosInstance.get(`/board/saved`, { params: params });

  return response;
};

export const boardModifyImageUpload = async (images: File[]) => {
  const formData = new FormData();
  images.forEach((file, index) => {
    formData.append(`files`, file);
  });

  try {
    const response = await axiosInstance.post(`/board/modifyImage`, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    console.log(response);

    return response;
  } catch (error) {
    console.error('Board Write failed:', error);
    throw error;
  }
};

export const boardModify = async (
  boardId: number,
  userId: number,
  title: string,
  content: string,
  category: string,
  boardOpen: boolean,
  imageUrls: string[],
) => {
  const body = {
    userId: userId,
    title: title,
    content: content,
    category: category,
    boardOpen: boardOpen,
    imageUrls: imageUrls,
  };

  const params = { boardId };

  try {
    const response = await axiosInstance.put(`/board`, body, { params: params });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

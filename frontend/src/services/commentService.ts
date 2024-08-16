import axiosInstance from './authService';

export const commentList = async (boardId: number) => {
  const params = { boardId: boardId };
  const response = await axiosInstance.get(`board/public/comment`, {params});

  console.log(response);
  return response.data.data;
}

export const commentWrite = async (boardId: number, content: string) => {
  const response = await axiosInstance.post(`/board/comment`,
    {
      boardId: boardId,
      content: content
    }
  )

  console.log(response);
}

export const commentDelete = async (commentId: number) => {
  const response = await axiosInstance.delete(`/board/comment?commentId=${commentId}`);

  console.log(response);
}

export const commentLike = async (commentId: number) => {
  const response = await axiosInstance.post(`/board/commentlike?commentId=${commentId}`);
  console.log(response);

  return response.data.data;
}

export const commentDislike = async (commentId: number) => {
  const response = await axiosInstance.delete(`/board/commentlike?commentId=${commentId}`);
  console.log(response);

  return response.data.data;
}
import axios from 'axios'
import axiosInstance from './authService';

export const userPage = async (userId: number) => {
  const response = await axios.get(`/user/public/info`, {params: {userId: userId}});
  
  return response.data.data;
}

export const deleteUser = async () => {
  const response = await axiosInstance.delete('/user');
  console.log(response);
}

export const followerList = async (userId: number) => {
  const response = await axios.get(`/user/public/follower/${userId}`);

  return response.data.data;
}

export const followingList = async (userId: number) => {
  const response = await axios.get(`/user/public/following/${userId}`);

  return response.data.data;
}
export const nicknameSearch = async (nickname: string, cursor: number | null = 0, limit: number = 10) => {
  const response = await axios.get(`/user/public/search?nickname=${nickname}&cursor=${cursor}&limit=${limit}`,);

  console.log(response.data);
  return (response.data.data);
}

export const userFollow = async (userId: number) => {
  const response = await axiosInstance.post(`/user/follow/${userId}`);

  return response;
}

export const userUnfollow = async (userId: number) => {
  const response = await axiosInstance.post(`/user/unfollow/${userId}`);

  return response;
}

export const userGetProfile = async () => {
  const response = await axiosInstance.get(`/user/profile`);

  return response;
}

type UpdateForm = {
  userBirthdate: string | null | undefined,
  userGender: string,
  nickname: string,
  introduction: string,
  interests: string[] | null
  profileImage: string | null,
}

export const userUpdateProfile = async (updateForm: UpdateForm, userId: number, isImageChanged: boolean = false) => {
  const formData = new FormData();

  const value = {
    userId: userId,
		birthdate: updateForm.userBirthdate,
		gender : updateForm.userGender, // M or F
		nickname : updateForm.nickname,
		introduction : updateForm.introduction,
    isOpen : true,
		interests : updateForm.interests
  }

  const blob = new Blob([JSON.stringify(value)], {type: "application/json"})
  formData.append('updateUserDto', blob);

  if (isImageChanged) {
    if (updateForm.profileImage !== null) {
      const binaryString = window.atob(updateForm.profileImage.split(',')[1]);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const imageBlob = new Blob([bytes], { type: "image/png" })
      formData.append(`profileImage`, imageBlob, `userProfileImage.png`);
    }
  }

  const response = await axiosInstance.put(`/user/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
}

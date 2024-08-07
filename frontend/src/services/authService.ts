import axios, { InternalAxiosRequestConfig } from "axios";
import { communityChatList } from "./communityChatService";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type LoginResponse = {
  Authorization: string,
  user: {
    userId: number,
    nickname: string,
    profileImage: string,
    similarUsers: object
  },
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.data.status;
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (status === 'A004' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = newToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/user/public/login', { email, password });
    const data = response.data.data;
    const Authorization = response.headers.authorization;
    const user = { userId: data.userId, 
                   nickname: data.nickname, 
                   profileImage: data.profileImage,
                   similarUsers: data.similarUsers}
    if (Authorization) {
      sessionStorage.setItem('accessToken', Authorization);
      sessionStorage.setItem('userId', data.userId);
      sessionStorage.setItem('nickname', data.nickname);
      sessionStorage.setItem('profileImage', data.profileImage);
      sessionStorage.setItem('similarUsers', JSON.stringify(data.similarUsers));
      sessionStorage.setItem('isLoggedIn', 'true');
      axiosInstance.defaults.headers['Authorization'] = Authorization;
      
    } else {
      console.error('No access token received from server');
    }

    return { Authorization, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const refreshToken = async() => {
 // refreshToken 요청에는 인터셉터를 적용하지 않음
 const response = await axios.post(`/user/public/refreshToken`, {}, {
    withCredentials: true
  });
  const accessToken = response.headers['Authorization'];
  sessionStorage.setItem('accessToken', accessToken);
  axiosInstance.defaults.headers['Authorization'] = accessToken;

  return accessToken;
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/user/public/logout');
    
    console.log(response)

    // 토큰 제거
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('nickname');
    sessionStorage.removeItem('profileImage');
    sessionStorage.removeItem('similarUsers');
    sessionStorage.removeItem('isLoggedIn');
    delete axiosInstance.defaults.headers['Authorization'];

  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const kakaoLogin = async () => {
  try {
    const response = await axios.get(`oauth/login/kakao`,{
        withCredentials: true
    });
    window.location.href = response.data.url;
  } catch (error) {
    console.error('kakao Login failed:', error);
    throw error;
  }
};

export const naverLogin = async () => {
  try {
    const response = await axios.get(`oauth/login/naver`,{
        withCredentials: true
    });
    window.location.href = response.data.url;
  } catch (error) {
    console.error('kakao Login failed:', error);
    throw error;
  }
}

export const getOAuthAccessToken = async (code: string): Promise<LoginResponse> => {
  try {
    const response = await axios.get(`oauth/get-user-token`, {
      params: {
        code
      }
    });
    const data = response.data.data;
    const Authorization = response.headers.authorization;
    console.log(data)
    const user = { userId: data.userId, 
                   nickname: data.nickname, 
                   profileImage: data.profileImage,
                   similarUsers: data.similarUsers}
    if (Authorization) {
      sessionStorage.setItem('accessToken', Authorization);
      sessionStorage.setItem('userId', data.userId);
      sessionStorage.setItem('nickname', data.nickname);
      sessionStorage.setItem('profileImage', data.profileImage);
      sessionStorage.setItem('similarUsers', JSON.stringify(data.similarUsers));
      sessionStorage.setItem('isLoggedIn', 'true');
      axiosInstance.defaults.headers['Authorization'] = Authorization;
      
      const response = await communityChatList(user.userId);
      sessionStorage.setItem('chatRoomList', JSON.stringify(response));
    } else {
      console.error('No access token received from server');
    }

    return { Authorization, user };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getOAuthInformation = async (token: string) => {
  try {
    const response = await axios.get(`oauth/get-oauth-info`, {
      params: {
        token
      }
    });    
    console.log(response)
    return response
  } catch (error) {
    console.error('kakao Login failed:', error);
    throw error;
  }
}

type RegistRequiredPayload = {
  userName: string,
  phoneNumber: string,
  userEmail: string,
  userPassword: string
}

type RegistOptionalPayload = {
  profileImage: string | null,
  nickname: string,
  userBirthdate: string | null | undefined,
  userGender: string,
  introduction: string,
  interests: string[] | null
}

type RegistForm = {
  required: RegistRequiredPayload,
  optional: RegistOptionalPayload
}

type ProviderInformation = {
  provider: string,
  providerId: string | null
}

export const registByEmail = async (registForm: RegistForm, providerInformation: ProviderInformation = {provider : 'local', providerId : null} ) => {
  const formData = new FormData();
  const value = {
    userName: registForm.required.userName,
		email: registForm.required.userEmail,
		password : registForm.required.userPassword,
		role: "ROLE_USER",
		birthdate: registForm.optional.userBirthdate,
		gender : registForm.optional.userGender, // M or F
		isOpen : true,
		nickname : registForm.optional.nickname,
		phoneNumber : registForm.required.phoneNumber,
		provider : providerInformation.provider,
	  providerId : providerInformation.providerId,
		introduction : registForm.optional.introduction,
		interests : registForm.optional.interests
  }
  const blob = new Blob([JSON.stringify(value)], {type: "application/json"})
  formData.append('registUserDto', blob);

  if (registForm.optional.profileImage !== null) {
    const binaryString = window.atob(registForm.optional.profileImage.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const imageBlob = new Blob([bytes], { type: "image/png" })
    formData.append(`profileImage`, imageBlob, `userProfileImage.png`);
  }

  try {
    const response = await axios.post('/user/public/regist', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response)
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const requestEmail = async (email: string) => {
  try {
    const response = await axios.post(`/email/request`, {
      email
    });
    console.log(response)

    return response
  } catch (error) {
    console.error('이메일 인증 요청 오류:', error);
  }
};

export const validateEmail = async (email: string, authCode: string) => {
  try {
    const response = await axios.post(`/email/validation`, {
      email,
      authCode
    });
    console.log(response);

    return response
  } catch (error) {
    console.error('이메일 인증 확인 오류:', error);
  }
};

export default axiosInstance;
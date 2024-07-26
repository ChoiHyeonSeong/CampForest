import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = 'http://192.168.100.203:8080';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type LoginResponse = {
  accessToken: string,
  user: {
    userId: number,
    nickname: string,
    profileImage: string
  }
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axiosInstance.defaults.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error)
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
    return Promise.reject(error)
  }
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/user/login', { email, password });
    const data = response.data.data;
    const accessToken = response.headers.authorization;
    const user = { userId: data.userId, nickname: data.nickname, profileImage: data.profileImage }
    
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axiosInstance.defaults.headers['Authorization'] = accessToken;
    } else {
      console.error('No access token received from server');
    }

    return { accessToken, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const refreshToken = async() => {
 // refreshToken 요청에는 인터셉터를 적용하지 않음
 const response = await axios.post(`${API_URL}/user/refreshToken`, {}, {
    withCredentials: true
  });
  const accessToken = response.headers['Authorization'];
  localStorage.setItem('accessToken', accessToken);
  axiosInstance.defaults.headers['Authorization'] = accessToken;

  return accessToken;
};

export const logout = async () => {
  try {
    await axiosInstance.post('/user/logout');

    // 토큰 제거
    localStorage.removeItem('accessToken');
    delete axiosInstance.defaults.headers['Authorization'];

  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export default axiosInstance;
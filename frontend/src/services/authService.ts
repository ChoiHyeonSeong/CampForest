import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = 'http://192.168.100.203:8080';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type LoginResponse = {
  accessToken: string,
  user: {
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
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
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
    const response = await axiosInstance.post('/user/login', { email, password });
    const data = response.data.data;
    const accessToken = response.headers.Authorization;
    const user = { nickname: data.nickname, profileImage: data.profileImage }

    localStorage.setItem('accessToken', accessToken);

    return { accessToken, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const refreshToken = async() => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/user/refreshToken');
    const { accessToken } = response.data;

    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('/user/logout');

    // 토큰 제거
    localStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export default axiosInstance;
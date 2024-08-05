import axios, { InternalAxiosRequestConfig } from "axios";

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
    const response = await axiosInstance.post('/user/auth/login', { email, password });
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
 const response = await axios.post(`/user/auth/refreshToken`, {}, {
    withCredentials: true
  });
  const accessToken = response.headers['Authorization'];
  sessionStorage.setItem('accessToken', accessToken);
  axiosInstance.defaults.headers['Authorization'] = accessToken;

  return accessToken;
};

export const logout = async () => {
  try {
    const result = await axiosInstance.post('/user/auth/logout');
    
    console.log(result)

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
    const result = await axios.get(`/login/kakao`,{
        withCredentials: true
    });
    window.location.href = result.data.url;

    console.log(result)

  } catch (error) {
    console.error('kakao Login failed:', error);
    throw error;
  }
};

export default axiosInstance;
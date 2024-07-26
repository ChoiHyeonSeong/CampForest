import axios from 'axios';
import { store } from '@store/store';
import { setAccessToken, clearToken } from '@store/authSlice';

const api = axios.create({
  baseURL: 'http://192.168.100.203:8080',
});

api.interceptors.request.use((config) => {
  const accessToken = store.getState().authStore.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const response = await axios.post('http://192.168.100.203:8080/user/refreshToken');
      const newAccessToken = response.data.refreshToken;
      store.dispatch(setAccessToken(newAccessToken));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    } catch (error) {
      store.dispatch(clearToken());
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});

export default api;
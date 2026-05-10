import axios from 'axios';
import { HTTP_BACKEND } from '../../config.js';

const api = axios.create({
  baseURL: HTTP_BACKEND,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

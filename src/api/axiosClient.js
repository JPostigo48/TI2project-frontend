import axios from 'axios';
import AuthService from '../services/auth.service';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

axiosClient.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
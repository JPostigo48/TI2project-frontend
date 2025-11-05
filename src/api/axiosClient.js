import axios from 'axios';
import AuthService from '../services/auth.service';

/**
 * Cliente Axios configurado con la base URL y cabecera de autorización
 * extraída del servicio de autenticación.  Si no se ha definido
 * `VITE_API_BASE_URL` se utilizará por defecto '/api'.  Este cliente
 * únicamente se utilizará cuando `VITE_USE_MOCK_DATA` sea `false`.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Interceptor para añadir el token a cada petición
axiosClient.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

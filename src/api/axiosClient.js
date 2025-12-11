import axios from 'axios';
import AuthService from '../services/auth.service';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

axiosClient.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosClient.interceptors.response.use(
  (response) => {
    console.log("Petición a: ",response.config.url," OK: ",response.data)
    return response;
  },
  (error) => {
    console.log("Petición ERROR: ",error.response)
    if (error.response) {
      const { status, data } = error.response;
      
      return Promise.reject({
        status,
        message: data.message || 'Error en la petición',
        data: data,
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
      });
    } else {
      return Promise.reject({
        message: error.message || 'Error desconocido',
      });
    }
  }
);

export default axiosClient;
import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import { mockLogin, mockLogout, mockRecoverPassword } from '../mocks/auth.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

class AuthService {
  /**
   * Iniciar sesión
   */
  async login(email, password) {
    if (USE_MOCK) {
      return mockLogin(email, password);
    }

    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    return response;
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    if (USE_MOCK) {
      return mockLogout();
    }

    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
    return response;
  }

  /**
   * Recuperar contraseña
   */
  async recoverPassword(email) {
    if (USE_MOCK) {
      return mockRecoverPassword(email);
    }

    const response = await axiosClient.post(ENDPOINTS.AUTH.RECOVER_PASSWORD, {
      email,
    });

    return response;
  }

  /**
   * Guardar datos de sesión en localStorage
   */
  saveSession(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtener token actual
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Limpiar sesión
   */
  clearSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
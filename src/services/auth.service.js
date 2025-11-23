import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import { mockLogin, mockLogout, mockRecoverPassword } from '../mocks/auth.mock';

// Si la variable de entorno VITE_USE_MOCK_DATA no está definida o no es
// igual a 'false', asumimos uso de datos simulados por defecto.  Esto
// permite alternar entre API real y mocks simplemente modificando la
// configuración en el archivo `.env`.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class AuthService {
  /**
   * Iniciar sesión. Envía las credenciales al backend y devuelve
   * datos del usuario junto con un token JWT. Cuando se utilizan
   * mocks se devuelve un objeto simulado.
   * @param {string} email Correo institucional del usuario
   * @param {string} password Contraseña
   */
  async login(email, password) {
    if (USE_MOCK) {
      return await mockLogin(email, password);
    }
    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    // Asumimos que la respuesta tiene forma { success, user, token }
    return response.data;
  }

  /**
   * Cerrar sesión. Limpia la sesión local y notifica al backend si
   * existe un endpoint de cierre de sesión.  Se usa POST por
   * convención aunque el backend actual no define esta ruta; si
   * devuelve error se ignora.
   */
  async logout() {
    if (USE_MOCK) {
      return await mockLogout();
    }
    try {
      await axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // La API de backend puede no implementar logout; ignoramos el error.
    }
    return { success: true };
  }

  /**
   * Solicitar recuperación de contraseña. Envía el correo al backend
   * para iniciar el flujo de recuperación. Si se usan mocks se
   * devuelve un mensaje simulado.
   */
  async recoverPassword(email) {
    if (USE_MOCK) {
      return await mockRecoverPassword(email);
    }
    const response = await axiosClient.post(ENDPOINTS.AUTH.RECOVER_PASSWORD, { email });
    return response.data;
  }

  /**
   * Guardar datos de sesión (usuario y token) en localStorage. Esto
   * permite mantener la autenticación incluso al recargar la página.
   */
  saveSession(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  /**
   * Obtener el usuario actual desde localStorage. Devuelve null si no
   * hay ningún usuario almacenado.
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtener el token JWT actual desde localStorage.
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Limpiar por completo la sesión almacenada en localStorage.
   */
  clearSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * Verificar si existe una sesión activa en localStorage.
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
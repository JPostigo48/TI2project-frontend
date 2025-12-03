import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';

/**
 * Servicio para consumir las rutas de administrador del backend.
 * Contiene funciones para obtener estadísticas, gestionar usuarios y
 * actualizar la configuración global.
 */
class AdminService {
  async getDashboard() {
    const res = await axiosClient.get(ENDPOINTS.ADMIN.DASHBOARD);
    return res.data;
  }

  async getSettings() {
    const res = await axiosClient.get(ENDPOINTS.ADMIN.SETTINGS);
    return res.data;
  }

  async updateSettings(settings) {
    const res = await axiosClient.put(ENDPOINTS.ADMIN.SETTINGS, settings);
    return res.data;
  }

  async createUser(data) {
    const res = await axiosClient.post(ENDPOINTS.ADMIN.USERS, data);
    return res.data;
  }

  async resetPassword(id, newPassword) {
    const res = await axiosClient.patch(
      `${ENDPOINTS.ADMIN.USERS}/${id}/reset-password`,
      { newPassword }
    );
    return res.data;
  }
}

export default new AdminService();
import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import {
  mockGetSchedule,
  mockGetGrades,
  mockGetLabs,
  mockEnrollLab,
} from '../mocks/student.mock';

// Por defecto utilizamos los mocks si la variable no está explícitamente en 'false'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class StudentService {
  /** Obtener horario del estudiante */
  async getSchedule() {
    if (USE_MOCK) {
      return mockGetSchedule();
    }
    const res = await axiosClient.get(ENDPOINTS.STUDENT.SCHEDULE);
    return res.data;
  }

  /** Obtener notas del estudiante */
  async getGrades() {
    if (USE_MOCK) {
      return mockGetGrades();
    }
    const res = await axiosClient.get(ENDPOINTS.STUDENT.GRADES);
    return res.data;
  }

  /** Obtener lista de laboratorios disponibles */
  async getLabs() {
    if (USE_MOCK) {
      return mockGetLabs();
    }
    const res = await axiosClient.get(ENDPOINTS.STUDENT.LABS);
    return res.data;
  }

  /** Inscribir al estudiante en un laboratorio */
  async enrollLab(labId) {
    if (USE_MOCK) {
      return mockEnrollLab(labId);
    }
    const res = await axiosClient.post(ENDPOINTS.STUDENT.ENROLL, { labId });
    return res.data;
  }
}

export default new StudentService();

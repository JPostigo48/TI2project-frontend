import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import AuthService from './auth.service';

// Mocks
import {
  mockGetStudentProfile,
  mockGetStudentSchedule,
  mockGetStudentGrades,
  mockGetAvailableLabs,
  // ✅ Asegúrate de crear o exportar esto en tu archivo student.mock.js
  // Si no tienes el mock aún, puedes comentar esta línea y el if(USE_MOCK) de abajo.
  mockGetDashboardSummary, 
} from '../mocks/student.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class StudentService {
  async getProfile() {
    if (USE_MOCK) return await mockGetStudentProfile();
    
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('No hay usuario autenticado');
    
    const response = await axiosClient.get(`${ENDPOINTS.STUDENT.PROFILE}/${user.id}`);
    return response.data;
  }

  async getSchedule() {
    if (USE_MOCK) return await mockGetStudentSchedule();

    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('No hay usuario autenticado');

    const response = await axiosClient.get(ENDPOINTS.STUDENT.SCHEDULE, {
      params: { studentId: user.id },
    });
    return response.data;
  }

  async getGrades({ summary = false } = {}) {
    if (USE_MOCK) return await mockGetStudentGrades();

    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('No hay usuario autenticado');

    const response = await axiosClient.get(ENDPOINTS.STUDENT.GRADES, {
      params: { studentId: user.id, summary },
    });
    return response.data;
  }

  /**
   * Obtener resumen para el Dashboard (Próxima clase y promedio).
   * Corresponde a `GET /dashboard/student-summary`.
   */
  async getDashboardSummary() {
    // 1. Manejo de Mock (Consistencia)
    if (USE_MOCK) {
      // Si no tienes este mock creado, comenta estas líneas o returnea un objeto dummy
       if (typeof mockGetDashboardSummary === 'function') {
           return await mockGetDashboardSummary();
       } else {
           console.warn("mockGetDashboardSummary no está implementado");
           return { stats: { average: 0, coursesCount: 0 }, nextClass: null };
       }
    }

    // 2. Petición Real usando Endpoint centralizado
    // Nota: No necesitamos enviar ID explícito porque el token en axiosClient identifica al usuario
    const response = await axiosClient.get(ENDPOINTS.STUDENT.SUMMARY);
    return response.data;
  }

  async getAvailableLabs({ courseCode, semester } = {}) {
    if (USE_MOCK) return await mockGetAvailableLabs();

    const params = {};
    if (courseCode) params.course = courseCode;
    if (semester) params.semester = semester;
    
    const response = await axiosClient.get(ENDPOINTS.STUDENT.LABS, { params });
    return response.data;
  }

  async enrollLab(courseCode, preferences) {
    if (USE_MOCK) throw new Error('Inscripción de laboratorio no implementada en mocks');

    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('No hay usuario autenticado');

    const payload = { courseCode, preferences };
    const response = await axiosClient.post(ENDPOINTS.STUDENT.ENROLL, payload);
    return response.data;
  }
}

export default new StudentService();
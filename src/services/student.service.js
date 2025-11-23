// src/services/student.service.js

import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import AuthService from './auth.service';

// Mocks se importan para mantener compatibilidad con el modo mock.
import {
  mockGetStudentProfile,
  mockGetStudentSchedule,
  mockGetStudentGrades,
  mockGetAvailableLabs,
} from '../mocks/student.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class StudentService {
  /**
   * Obtener el perfil del estudiante autenticado.  En modo API se
   * realiza una petición GET a `/users/:id`.  En modo mock se
   * devuelve el objeto simulado. Si no hay usuario guardado se
   * lanza un error.
   */
  async getProfile() {
    if (USE_MOCK) {
      return await mockGetStudentProfile();
    }
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    const response = await axiosClient.get(`${ENDPOINTS.STUDENT.PROFILE}/${user.id}`);
    return response.data;
  }

  /**
   * Obtener el horario del estudiante.  El backend aún no expone un
   * endpoint específico para horarios, por lo que se consulta `/courses`
   * con el parámetro `studentId`. El backend puede devolver todos los
   * cursos y se filtrarán en el servidor; de lo contrario, esta
   * implementación se deberá ajustar cuando exista un endpoint más
   * específico. En modo mock se devuelve el horario simulado.
   */
  async getSchedule() {
    if (USE_MOCK) {
      return await mockGetStudentSchedule();
    }
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    const response = await axiosClient.get(ENDPOINTS.STUDENT.SCHEDULE, {
      params: { studentId: user.id },
    });
    return response.data;
  }

  /**
   * Obtener las notas del estudiante. Se consulta `/grades` con el
   * parámetro `studentId` para que el backend devuelva todas las
   * evaluaciones y notas del alumno. Si `summary=true`, el backend
   * devolverá estadísticas además de la lista. En modo mock se
   * devuelven las notas simuladas.
   */
  async getGrades({ summary = false } = {}) {
    if (USE_MOCK) {
      return await mockGetStudentGrades();
    }
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    const response = await axiosClient.get(ENDPOINTS.STUDENT.GRADES, {
      params: { studentId: user.id, summary },
    });
    return response.data;
  }

  /**
   * Obtener los grupos de laboratorio disponibles.  Se puede filtrar
   * por `courseCode` y/o `semester`.  Corresponde a `GET /labs/groups`.
   */
  async getAvailableLabs({ courseCode, semester } = {}) {
    if (USE_MOCK) {
      return await mockGetAvailableLabs();
    }
    const params = {};
    if (courseCode) params.course = courseCode;
    if (semester) params.semester = semester;
    const response = await axiosClient.get(ENDPOINTS.STUDENT.LABS, { params });
    return response.data;
  }

  async enrollLab(courseCode, preferences) {
    if (USE_MOCK) {
      throw new Error('Inscripción de laboratorio no implementada en mocks');
    }
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    const payload = { courseCode, preferences };
    const response = await axiosClient.post(ENDPOINTS.STUDENT.ENROLL, payload);
    return response.data;
  }
}

export default new StudentService();
import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import {
  mockGetAttendanceList,
  mockSubmitAttendance,
  mockGetTeacherSchedule,
  mockGetTeacherGrades,
  mockUpdateGrade,
  mockGetRooms,
  mockReserveRoom,
} from '../mocks/teacher.mock';

// Por defecto utilizamos los mocks si la variable no está explícitamente en 'false'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class TeacherService {
  /** Obtener lista de estudiantes para tomar asistencia */
  async getAttendanceList() {
    if (USE_MOCK) return mockGetAttendanceList();
    const res = await axiosClient.get(ENDPOINTS.TEACHER.ATTENDANCE_LIST);
    return res.data;
  }

  /** Enviar asistencia */
  async submitAttendance(payload) {
    if (USE_MOCK) return mockSubmitAttendance(payload);
    const res = await axiosClient.post(ENDPOINTS.TEACHER.SUBMIT_ATTENDANCE, payload);
    return res.data;
  }

  /** Obtener horario del docente */
  async getSchedule() {
    if (USE_MOCK) return mockGetTeacherSchedule();
    const res = await axiosClient.get(ENDPOINTS.TEACHER.SCHEDULE);
    return res.data;
  }

  /** Obtener lista de notas que administra el docente */
  async getGrades() {
    if (USE_MOCK) return mockGetTeacherGrades();
    const res = await axiosClient.get(ENDPOINTS.TEACHER.GRADES);
    return res.data;
  }

  /** Actualizar nota */
  async updateGrade(gradeId, score) {
    if (USE_MOCK) return mockUpdateGrade(gradeId, score);
    const res = await axiosClient.put(ENDPOINTS.TEACHER.UPDATE_GRADE, { gradeId, score });
    return res.data;
  }

  /** Obtener ambientes disponibles */
  async getRooms() {
    if (USE_MOCK) return mockGetRooms();
    const res = await axiosClient.get(ENDPOINTS.TEACHER.ROOMS);
    return res.data;
  }

  /** Reservar un ambiente */
  async reserveRoom(payload) {
    if (USE_MOCK) return mockReserveRoom(payload);
    const res = await axiosClient.post(ENDPOINTS.TEACHER.RESERVE_ROOM, payload);
    return res.data;
  }
}

export default new TeacherService();

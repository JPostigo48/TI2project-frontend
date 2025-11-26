import {
  mockGetTeacherProfile,
  mockGetTeacherSchedule,
  mockGetTeacherRoster,
  mockOpenAttendanceSession,
  mockMarkAttendance,
  mockCloseAttendanceSession,
  mockListAttendanceSessions,
  mockGetTeacherGradesSummary,
  mockSetTeacherGrade,
  mockSetTeacherSubstitutive,
  rooms as mockRooms,
  mockReserveRoom,
  mockListRoomReservations,
  mockGetAllGradesSummaryLogic 
} from '../mocks/teacher.mock';

import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import AuthService from './auth.service';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class TeacherService {
  
  // --- HELPER PRIVADO ---
  _getUserId() {
    const user = AuthService.getCurrentUser();
    if (!user?.id) {
      throw new Error('Sesión no válida o usuario no autenticado');
    }
    return user.id;
  }

  // --- PERFIL Y HORARIO ---

  async getProfile() {
    if (USE_MOCK) return await mockGetTeacherProfile();
    const userId = this._getUserId();
    const response = await axiosClient.get(`${ENDPOINTS.STUDENT.PROFILE}/${userId}`);
    return response.data;
  }

  async getSchedule() {
    if (USE_MOCK) return await mockGetTeacherSchedule();
    const userId = this._getUserId();
    const response = await axiosClient.get(ENDPOINTS.TEACHER.SCHEDULE, {
      params: { teacherId: userId },
    });
    return response.data;
  }

  // --- GESTIÓN DE CURSOS ---

  async getRoster(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherRoster(courseCode, section);
    
    const response = await axiosClient.get(`${ENDPOINTS.TEACHER.SCHEDULE}/${courseCode}/sections`, {
      params: { section },
    });
    return response.data?.students || response.data?.roster || [];
  }

  // --- ASISTENCIA ---

  async openAttendanceSession(payload) {
    if (USE_MOCK) return await mockOpenAttendanceSession(payload);
    
    const response = await axiosClient.post(ENDPOINTS.TEACHER.SUBMIT_ATTENDANCE, payload);
    return response.data?.id || response.data?.sessionId || response.data;
  }

  async markAttendance({ sessionId, studentId, status }) {
    if (USE_MOCK) return await mockMarkAttendance({ sessionId, studentId, status });
    
    await axiosClient.patch(
      `${ENDPOINTS.TEACHER.ATTENDANCE_LIST}/${sessionId}/entry/${studentId}`,
      { status },
    );
    return true;
  }

  async closeAttendanceSession(sessionId) {
    if (USE_MOCK) return await mockCloseAttendanceSession(sessionId);
    
    await axiosClient.patch(`${ENDPOINTS.TEACHER.ATTENDANCE_LIST}/${sessionId}`, {
      status: 'CLOSED',
    });
    return true;
  }

  async listAttendanceSessions(courseCode, section) {
    if (USE_MOCK) return await mockListAttendanceSessions({ courseCode, section });
    
    const params = {};
    if (courseCode && section) {
      params.section = `${courseCode}-${section}`;
    }
    const response = await axiosClient.get(ENDPOINTS.TEACHER.ATTENDANCE_LIST, { params });
    return response.data;
  }

  // --- CALIFICACIONES ---

  async getGradesSummary(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherGradesSummary(courseCode, section);
    
    const params = { summary: true };
    if (courseCode && section) {
      params.section = `${courseCode}-${section}`;
    }
    const response = await axiosClient.get(ENDPOINTS.TEACHER.GRADES, { params });
    return response.data;
  }

  async getAllGradesSummary() {
    if (USE_MOCK) {
       if (typeof mockGetAllGradesSummaryLogic === 'function') {
           return await mockGetAllGradesSummaryLogic();
       }
       return await this._simulateGetAllGradesSummary(); 
    }

    const response = await axiosClient.get(ENDPOINTS.TEACHER.GRADES, {
      params: { summary: true },
    });
    return response.data;
  }

  async setGrade(payload) {
    if (USE_MOCK) return await mockSetTeacherGrade(payload);
    const response = await axiosClient.post(ENDPOINTS.TEACHER.UPDATE_GRADE, payload);
    return response.data;
  }

  async setSubstitutive(payload) {
    if (USE_MOCK) return await mockSetTeacherSubstitutive(payload);
    const response = await axiosClient.post(ENDPOINTS.TEACHER.UPDATE_GRADE, payload);
    return response.data;
  }

  // --- AULAS ---

  async getRooms() {
    if (USE_MOCK) return mockRooms;
    const response = await axiosClient.get(ENDPOINTS.TEACHER.ROOMS);
    return response.data;
  }

  async getRoomReservations(filter = {}) {
    if (USE_MOCK) {
      return typeof mockListRoomReservations === 'function' 
        ? await mockListRoomReservations(filter) 
        : [];
    }
    
    const params = {};
    if (filter.roomId) params.room = filter.roomId;
    if (filter.date) params.date = filter.date;
    
    const response = await axiosClient.get(ENDPOINTS.TEACHER.ROOM_RESERVATIONS, { params });
    return response.data;
  }

  async reserveRoom(payload) {
    if (USE_MOCK) return await mockReserveRoom(payload);
    
    const response = await axiosClient.post(ENDPOINTS.TEACHER.RESERVE_ROOM, payload);
    return response.data?.id || response.data;
  }

  async _simulateGetAllGradesSummary() {
    const schedule = await mockGetTeacherSchedule();
    const uniqueAssignments = new Map(); 
    
    schedule.forEach(b => {
        const key = `${b.courseCode}-${b.section}`;
        if (!uniqueAssignments.has(key)) {
            uniqueAssignments.set(key, { courseCode: b.courseCode, section: b.section });
        }
    });

    let result = [];
    const promises = Array.from(uniqueAssignments.values()).map(async (asg) => {
        const summaries = await mockGetTeacherGradesSummary(asg.courseCode, asg.section);
        return summaries.map(row => ({
            ...row,
            courseCode: asg.courseCode,
            section: asg.section
        }));
    });

    const results = await Promise.all(promises);
    return results.flat();
  }
}

export default new TeacherService();
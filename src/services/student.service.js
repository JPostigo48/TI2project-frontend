import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import AuthService from './auth.service';

// Mocks
import {
  mockGetStudentProfile,
  mockGetStudentSchedule,
  mockGetStudentGrades,
  mockGetAvailableLabs,
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

    const response = await axiosClient.get(ENDPOINTS.STUDENT.SCHEDULE, {});
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

  async getDashboardSummary() {
    if (USE_MOCK) {
       if (typeof mockGetDashboardSummary === 'function') {
           return await mockGetDashboardSummary();
       } else {
           console.warn("mockGetDashboardSummary no está implementado");
           return { stats: { average: 0, coursesCount: 0 }, nextClass: null };
       }
    }

    const response = await axiosClient.get(ENDPOINTS.STUDENT.SUMMARY);
    return response.data;
  }

  async getAvailableLabs({ courseId, semesterId } = {}) {
    if (USE_MOCK && typeof mockGetAvailableLabs === 'function') {
      return await mockGetAvailableLabs({ courseId, semesterId });
    }

    const params = {};
    if (courseId) params.course = courseId;
    if (semesterId) params.semester = semesterId;

    const response = await axiosClient.get(ENDPOINTS.STUDENT.LABS, { params });
    return response.data;
  }


  async enrollLab({ courseId, semesterId, preferences }) {
    if (!Array.isArray(preferences) || preferences.length === 0) {
      throw new Error('Debes seleccionar al menos una preferencia');
    }

    if (USE_MOCK) {
      throw new Error('Inscripción de laboratorio no implementada en mocks');
    }

    const payload = {
      course: courseId,
      semester: semesterId,
      preferences,
    };

    const response = await axiosClient.post(ENDPOINTS.STUDENT.ENROLL, payload);
    return response.data;
  }

  async getEnrollment(courseId) {
    if (USE_MOCK) {
       return { labPreferences: [] }; 
    }
    const response = await axiosClient.get(`/student/enrollment/${courseId}`);
    return response.data;
  }

  async getMyCourses() {
    const res = await axiosClient.get('/student/courses');
    return res.data || [];
  }

  async getCourseAttendance(courseId) {
    const res = await axiosClient.get(`/student/attendance/${courseId}`);
    return res.data;
  }

}

export default new StudentService();
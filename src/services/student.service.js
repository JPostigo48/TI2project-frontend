// src/services/student.service.js

import {
  mockGetStudentProfile,
  mockGetStudentSchedule,
  mockGetStudentGrades,
  mockGetAvailableLabs,
} from '../mocks/student.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class StudentService {
  async getProfile() {
    if (USE_MOCK) {
      return await mockGetStudentProfile();
    }
    // Aquí iría la llamada real al backend (ej. axios.get('/students/me'))
    throw new Error('API real no implementada');
  }

  async getSchedule() {
    if (USE_MOCK) {
      return await mockGetStudentSchedule();
    }
    throw new Error('API real no implementada');
  }

  async getGrades() {
    if (USE_MOCK) {
      return await mockGetStudentGrades();
    }
    throw new Error('API real no implementada');
  }

  async getAvailableLabs() {
    if (USE_MOCK) {
      return await mockGetAvailableLabs();
    }
    throw new Error('API real no implementada');
  }
}

export default new StudentService();

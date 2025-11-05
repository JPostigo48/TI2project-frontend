// src/services/teacher.service.js

import {
  mockGetTeacherProfile,
  mockGetTeacherSchedule,
  mockGetTeacherRoster,
  mockOpenAttendanceSession,
  mockMarkAttendance,
  mockCloseAttendanceSession,
  mockGetTeacherGradesSummary,
  mockSetTeacherGrade,
  mockSetTeacherSubstitutive,
  rooms as mockRooms,
} from '../mocks/teacher.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class TeacherService {
  async getProfile() {
    if (USE_MOCK) return await mockGetTeacherProfile();
    throw new Error('API real no implementada');
  }

  async getSchedule() {
    if (USE_MOCK) return await mockGetTeacherSchedule();
    throw new Error('API real no implementada');
  }

  async getRoster(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherRoster(courseCode, section);
    throw new Error('API real no implementada');
  }

  async openAttendanceSession(payload) {
    if (USE_MOCK) return await mockOpenAttendanceSession(payload);
    throw new Error('API real no implementada');
  }

  async markAttendance(payload) {
    if (USE_MOCK) return await mockMarkAttendance(payload);
    throw new Error('API real no implementada');
  }

  async closeAttendanceSession(sessionId) {
    if (USE_MOCK) return await mockCloseAttendanceSession(sessionId);
    throw new Error('API real no implementada');
  }

  async getGradesSummary(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherGradesSummary(courseCode, section);
    throw new Error('API real no implementada');
  }

  async setGrade(payload) {
    if (USE_MOCK) return await mockSetTeacherGrade(payload);
    throw new Error('API real no implementada');
  }

  async setSubstitutive(payload) {
    if (USE_MOCK) return await mockSetTeacherSubstitutive(payload);
    throw new Error('API real no implementada');
  }

  async getRooms() {
    if (USE_MOCK) return mockRooms;
    throw new Error('API real no implementada');
  }
}

export default new TeacherService();

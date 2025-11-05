// Servicio para operaciones relacionadas al docente.
// Esta clase abstrae el origen de los datos (mock o API real).

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
} from '../mocks/teacher.mock';

// Determina si se debe utilizar datos simulados. Por defecto se usan mocks
// salvo que la variable de entorno VITE_USE_MOCK_DATA sea explícitamente
// 'false'.
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

  async listAttendanceSessions(courseCode, section) {
    // Devuelve todas las sesiones de asistencia filtradas opcionalmente por
    // curso y sección. Este método es útil para mostrar un resumen de las
    // asistencias ya tomadas.
    if (USE_MOCK) return await mockListAttendanceSessions({ courseCode, section });
    throw new Error('API real no implementada');
  }

  async getGradesSummary(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherGradesSummary(courseCode, section);
    throw new Error('API real no implementada');
  }

  async getAllGradesSummary() {
    // Obtiene el resumen de notas de todos los cursos/secciones asignados al
    // docente. Cada entrada incluye courseCode y section para que se puedan
    // identificar posteriormente.
    if (!USE_MOCK) {
      throw new Error('API real no implementada');
    }
    // Obtener horario para saber qué cursos y secciones dicta el docente.
    const schedule = await mockGetTeacherSchedule();
    // Construir conjunto único de combinaciones curso-sección para evitar
    // duplicados (un mismo curso aparece varias veces si tiene múltiples
    // bloques).
    const unique = new Set();
    const assignments = [];
    for (const b of schedule) {
      const key = `${b.courseCode}-${b.section}`;
      if (!unique.has(key)) {
        unique.add(key);
        assignments.push({ courseCode: b.courseCode, section: b.section });
      }
    }
    // Obtener el resumen de notas para cada asignación y aplanar.
    let result = [];
    for (const asg of assignments) {
      const summaries = await mockGetTeacherGradesSummary(asg.courseCode, asg.section);
      const withCourseInfo = summaries.map((row) => ({
        ...row,
        courseCode: asg.courseCode,
        section: asg.section,
      }));
      result = result.concat(withCourseInfo);
    }
    return result;
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
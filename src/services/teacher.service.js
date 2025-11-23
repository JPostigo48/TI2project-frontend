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
  mockReserveRoom,
  mockListRoomReservations,
} from '../mocks/teacher.mock';

// Importar cliente HTTP, definición de endpoints y servicio de
// autenticación para construir las llamadas a la API real.
import axiosClient from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import AuthService from './auth.service';

// Determina si se debe utilizar datos simulados. Por defecto se usan mocks
// salvo que la variable de entorno VITE_USE_MOCK_DATA sea explícitamente
// 'false'.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

class TeacherService {
  async getProfile() {
    if (USE_MOCK) return await mockGetTeacherProfile();
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    // Obtenemos el perfil del usuario por su id. El backend
    // devolverá la información completa del docente. Si solo
    // estuviera disponible para el propio usuario, el middleware de
    // autorización validará el token.
    const response = await axiosClient.get(`${ENDPOINTS.STUDENT.PROFILE}/${user.id}`);
    return response.data;
  }

  async getSchedule() {
    if (USE_MOCK) return await mockGetTeacherSchedule();
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    // Solicitamos los cursos filtrando por teacherId. El backend
    // debería devolver solo aquellos cursos que dicta el docente.
    const response = await axiosClient.get(ENDPOINTS.TEACHER.SCHEDULE, {
      params: { teacherId: user.id },
    });
    return response.data;
  }

  async getRoster(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherRoster(courseCode, section);
    // Obtener la lista de alumnos inscritos en una sección concreta.
    // En la versión actual del backend no existe un endpoint
    // específico para rosters de un curso/sección, por lo que se
    // consulta la ruta de secciones dentro del recurso cursos y se
    // filtra por el nombre de la sección.  Si el backend agrega un
    // endpoint específico como `/courses/:courseId/sections/:sectionId/roster`,
    // este código se debería actualizar.
    const response = await axiosClient.get(`${ENDPOINTS.TEACHER.SCHEDULE}/${courseCode}/sections`, {
      params: { section },
    });
    // Asumimos que la respuesta contiene un arreglo `students` o
    // `roster` que incluye la lista de alumnos. Si no existe dicha
    // estructura se devuelve un array vacío.
    return response.data?.students || response.data?.roster || [];
  }

  async openAttendanceSession(payload) {
    if (USE_MOCK) return await mockOpenAttendanceSession(payload);
    // Crear una nueva sesión de asistencia. Se envía el payload con
    // courseCode, section y opcionalmente blockId. El backend genera
    // una sesión con lista de alumnos en estado ausente y devuelve
    // un identificador de sesión.
    const response = await axiosClient.post(ENDPOINTS.TEACHER.SUBMIT_ATTENDANCE, payload);
    // Según la implementación, el backend podría devolver
    // { id: ..., ... } o { sessionId: ... }. Se intenta devolver
    // cualquier identificador válido.
    return response.data?.id || response.data?.sessionId || response.data;
  }

  async markAttendance(payload) {
    if (USE_MOCK) return await mockMarkAttendance(payload);
    const { sessionId, studentId, status } = payload;
    // Registrar presencia/ausencia/tardanza para un estudiante en una
    // sesión. El backend expone PATCH /attendance/:sessionId/entry/:studentId.
    await axiosClient.patch(
      `${ENDPOINTS.TEACHER.ATTENDANCE_LIST}/${sessionId}/entry/${studentId}`,
      { status },
    );
    return true;
  }

  async closeAttendanceSession(sessionId) {
    if (USE_MOCK) return await mockCloseAttendanceSession(sessionId);
    // Cerrar una sesión de asistencia. El backend actual no define
    // explícitamente esta ruta, por lo que enviamos un PATCH con
    // estado cerrado. En caso de que se defina una ruta específica
    // como `/attendance/:sessionId/close`, se debería actualizar.
    await axiosClient.patch(`${ENDPOINTS.TEACHER.ATTENDANCE_LIST}/${sessionId}`, {
      status: 'CLOSED',
    });
    return true;
  }

  async listAttendanceSessions(courseCode, section) {
    // Devuelve todas las sesiones de asistencia filtradas opcionalmente por
    // curso y sección. Este método es útil para mostrar un resumen de las
    // asistencias ya tomadas.
    if (USE_MOCK) return await mockListAttendanceSessions({ courseCode, section });
    const params = {};
    if (courseCode && section) {
      // El backend espera el parámetro `section` en formato
      // <courseCode>-<section>, por ejemplo 'CS101-A'.
      params.section = `${courseCode}-${section}`;
    }
    const response = await axiosClient.get(ENDPOINTS.TEACHER.ATTENDANCE_LIST, { params });
    return response.data;
  }

  async getGradesSummary(courseCode, section) {
    if (USE_MOCK) return await mockGetTeacherGradesSummary(courseCode, section);
    const params = {};
    if (courseCode && section) {
      params.section = `${courseCode}-${section}`;
    }
    params.summary = true;
    const response = await axiosClient.get(ENDPOINTS.TEACHER.GRADES, { params });
    return response.data;
  }

  async getAllGradesSummary() {
    // Obtiene el resumen de notas de todos los cursos/secciones asignados al
    // docente. Cada entrada incluye courseCode y section para que se puedan
    // identificar posteriormente.
    if (!USE_MOCK) {
      // Solicitar todos los resúmenes de notas. Si el backend no
      // soporta esta consulta devolverá una lista vacía o un error.
      const response = await axiosClient.get(ENDPOINTS.TEACHER.GRADES, {
        params: { summary: true },
      });
      return response.data;
    }
    // Modo mock: replicar la lógica anterior obteniendo asignaciones
    // únicas desde el horario simulado y combinando los resúmenes.
    const schedule = await mockGetTeacherSchedule();
    const unique = new Set();
    const assignments = [];
    for (const b of schedule) {
      const key = `${b.courseCode}-${b.section}`;
      if (!unique.has(key)) {
        unique.add(key);
        assignments.push({ courseCode: b.courseCode, section: b.section });
      }
    }
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
    // Crear o actualizar una nota. El payload debe contener:
    // { section: 'CS101-A', studentId: 'stu1', evaluation: 'P1', type: 'continuous' | 'exam' | 'substitutive', value: number }
    const response = await axiosClient.post(ENDPOINTS.TEACHER.UPDATE_GRADE, payload);
    return response.data;
  }

  async setSubstitutive(payload) {
    if (USE_MOCK) return await mockSetTeacherSubstitutive(payload);
    // Para consistencia, enviamos el payload al mismo endpoint de notas.
    const response = await axiosClient.post(ENDPOINTS.TEACHER.UPDATE_GRADE, payload);
    return response.data;
  }

  async getRooms() {
    if (USE_MOCK) return mockRooms;
    const response = await axiosClient.get(ENDPOINTS.TEACHER.ROOMS);
    return response.data;
  }

  /**
   * Consultar reservas de aulas existentes. Permite filtrar por
   * identificador de aula (`roomId`) y fecha (`YYYY-MM-DD`).
   */
  async getRoomReservations(filter = {}) {
    if (USE_MOCK) {
      // Usamos la función mock si está disponible. El mock se
      // incorporó en la modificación anterior.
      if (typeof mockListRoomReservations === 'function') {
        return await mockListRoomReservations(filter);
      }
      return [];
    }
    const params = {};
    if (filter.roomId) params.room = filter.roomId;
    if (filter.date) params.date = filter.date;
    const response = await axiosClient.get(ENDPOINTS.TEACHER.ROOM_RESERVATIONS, { params });
    return response.data;
  }

  /**
   * Reservar un aula para actividades adicionales. Recibe un
   * objeto con las propiedades `roomId`, `date`, `startTime`,
   * `endTime` y opcionalmente `reason`. Devuelve el identificador
   * de la reserva creada.  El mock arroja un error en caso de
   * conflicto.
   */
  async reserveRoom(payload) {
    if (USE_MOCK) return await mockReserveRoom(payload);
    const response = await axiosClient.post(ENDPOINTS.TEACHER.RESERVE_ROOM, payload);
    return response.data?.id || response.data;
  }
}

export default new TeacherService();
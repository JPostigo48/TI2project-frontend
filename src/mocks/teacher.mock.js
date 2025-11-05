// Modified teacher.mock.js with week tracking for attendance sessions

// Based on original file from TI2project-frontend
// Importa el catálogo de cursos desde el mock de estudiantes
import { coursesById } from './student.mock';

// Perfil del docente (sin cambios)
export const teacherProfile = {
  id: 'tch-001',
  code: 'DOC2024001',
  name: 'Ing. Ramos',
  role: 'TEACHER',
  assignments: [
    { courseCode: 'CS101', section: 'A' },
    { courseCode: 'CS202', section: 'B' },
  ],
};

// Deriva bloques de horario según asignaciones y catálogo
export function getTeacherSchedule(profile = teacherProfile, catalog = coursesById) {
  const blocks = [];
  for (const asg of profile.assignments) {
    const course = catalog[asg.courseCode];
    if (!course) continue;
    for (const b of course.scheduleBlocks) {
      blocks.push({
        id: `${asg.courseCode}-${asg.section}-${b.day}-${b.startTime}`,
        courseCode: asg.courseCode,
        courseName: course.name,
        section: asg.section,
        day: b.day,
        startTime: b.startTime,
        endTime: b.endTime,
        room: b.room,
        studentCount: 30,
      });
    }
  }
  return blocks;
}

// Roster por sección (lista de alumnos matriculados)
const rostersByCourseSection = {
  'CS101-A': [
    { id: 'stu1', code: '20201234', name: 'Carlos Gómez' },
    { id: 'stu2', code: '20205678', name: 'Ana Martínez' },
    { id: 'stu3', code: '20207890', name: 'Luis Rodríguez' },
  ],
  'CS202-B': [
    { id: 'stu4', code: '20204561', name: 'María Pérez' },
    { id: 'stu5', code: '20206789', name: 'Jorge Díaz' },
    { id: 'stu2', code: '20205678', name: 'Ana Martínez' },
  ],
};
export function getTeacherRoster(courseCode, section) {
  return rostersByCourseSection[`${courseCode}-${section}`] ?? [];
}

// Sesiones de asistencia (abiertas/cerradas) con semana
const attendanceSessions = []; // { id, courseCode, section, blockId, openedAt, closedAt, status, week, records[] }

// Abre sesión de asistencia para un bloque, asignando número de semana
export function openAttendanceSession({ courseCode, section, blockId, openedAt = new Date().toISOString() }) {
  // Cerrar cualquier sesión abierta para el mismo bloque
  for (const s of attendanceSessions) {
    if (s.courseCode === courseCode && s.section === section && s.blockId === blockId && s.status === 'OPEN') {
      s.status = 'CLOSED';
      s.closedAt = openedAt;
    }
  }
  // Calcular la próxima semana basándose en sesiones existentes del mismo curso y sección
  const sessionsForCourse = attendanceSessions.filter((s) => s.courseCode === courseCode && s.section === section);
  let nextWeek = 1;
  if (sessionsForCourse.length > 0) {
    const maxWeek = Math.max(...sessionsForCourse.map((s) => Number(s.week || 0)));
    nextWeek = maxWeek + 1;
  }
  const id = `att-${courseCode}-${section}-${Date.now()}`;
  attendanceSessions.push({
    id,
    courseCode,
    section,
    blockId,
    openedAt,
    closedAt: null,
    status: 'OPEN',
    week: nextWeek,
    records: [],
  });
  return id;
}
// Marca asistencia de un alumno
export function markAttendance({ sessionId, studentId, status }) {
  const session = attendanceSessions.find((s) => s.id === sessionId);
  if (!session || session.status !== 'OPEN') {
    throw new Error('Sesión no encontrada o no está abierta');
  }
  const now = new Date().toISOString();
  const existing = session.records.find((r) => r.studentId === studentId);
  if (existing) {
    existing.status = status;
    existing.time = now;
  } else {
    session.records.push({ studentId, status, time: now });
  }
  return true;
}
// Cierra sesión
export function closeAttendanceSession(sessionId) {
  const session = attendanceSessions.find((s) => s.id === sessionId);
  if (!session || session.status !== 'OPEN') {
    throw new Error('Sesión no encontrada o ya cerrada');
  }
  session.status = 'CLOSED';
  session.closedAt = new Date().toISOString();
  return true;
}
export function listAttendanceSessions({ courseCode, section } = {}) {
  return attendanceSessions.filter((s) => (
    (!courseCode || s.courseCode === courseCode) && (!section || s.section === section)
  ));
}

// Gestión de notas (sin cambios en esta sección)
const teacherGradesByCourse = {
  CS101: {
    A: {
      stu1: {
        P1: { continuous: 14, exam: 15 },
        P2: { continuous: 13, exam: 16 },
        P3: { continuous: 16, exam: 14 },
        substitutive: null,
      },
      stu2: {
        P1: { continuous: 17, exam: 18 },
        P2: { continuous: 16, exam: 17 },
        P3: { continuous: 15, exam: 17 },
        substitutive: null,
      },
      stu3: {
        P1: { continuous: 12, exam: 13 },
        P2: { continuous: 14, exam: 10 },
        P3: { continuous: 15, exam: 14 },
        substitutive: 15,
      },
    },
  },
  CS202: {
    B: {
      stu4: {
        P1: { continuous: 16, exam: 14 },
        P2: { continuous: 15, exam: 16 },
        P3: { continuous: 18, exam: 17 },
        substitutive: null,
      },
      stu5: {
        P1: { continuous: 14, exam: 12 },
        P2: { continuous: 16, exam: 15 },
        P3: { continuous: 17, exam: 16 },
        substitutive: 14,
      },
      stu2: {
        P1: { continuous: 18, exam: 17 },
        P2: { continuous: 17, exam: 16 },
        P3: { continuous: 19, exam: 19 },
        substitutive: null,
      },
    },
  },
};

function computePartialScore(partial, weights) {
  const c = Number(partial?.continuous ?? 0);
  const e = Number(partial?.exam ?? 0);
  return c * (weights.continuous ?? 0) + e * (weights.exam ?? 0);
}
function computeCourseFinalForStudent(courseCode, studentGrades, catalog = coursesById) {
  const scheme = catalog[courseCode]?.evaluationScheme;
  if (!scheme || !studentGrades) return null;
  let P1 = computePartialScore(studentGrades.P1, scheme.partials.P1.weights);
  let P2 = computePartialScore(studentGrades.P2, scheme.partials.P2.weights);
  const P3 = computePartialScore(studentGrades.P3, scheme.partials.P3.weights);
  if (
    scheme.hasSubstitutive &&
    studentGrades.substitutive != null &&
    scheme.substitutiveReplaces === 'minExamOfP1P2'
  ) {
    const exam1 = Number(studentGrades.P1?.exam ?? 0);
    const exam2 = Number(studentGrades.P2?.exam ?? 0);
    const minExam = Math.min(exam1, exam2);
    if (studentGrades.substitutive > minExam) {
      if (exam1 <= exam2) {
        const newP1 = { ...studentGrades.P1, exam: studentGrades.substitutive };
        P1 = computePartialScore(newP1, scheme.partials.P1.weights);
      } else {
        const newP2 = { ...studentGrades.P2, exam: studentGrades.substitutive };
        P2 = computePartialScore(newP2, scheme.partials.P2.weights);
      }
    }
  }
  const fw = scheme.finalWeights;
  const finalScore = P1 * fw.P1 + P2 * fw.P2 + P3 * fw.P3;
  return { P1, P2, P3, finalScore };
}
export function getTeacherGrades(courseCode, section) {
  return teacherGradesByCourse?.[courseCode]?.[section] ?? {};
}
export function setTeacherGrade({ courseCode, section, studentId, partial, kind, value }) {
  if (!teacherGradesByCourse[courseCode]) teacherGradesByCourse[courseCode] = {};
  if (!teacherGradesByCourse[courseCode][section]) teacherGradesByCourse[courseCode][section] = {};
  if (!teacherGradesByCourse[courseCode][section][studentId]) {
    teacherGradesByCourse[courseCode][section][studentId] = {
      P1: { continuous: 0, exam: 0 },
      P2: { continuous: 0, exam: 0 },
      P3: { continuous: 0, exam: 0 },
      substitutive: null,
    };
  }
  teacherGradesByCourse[courseCode][section][studentId][partial][kind] = Number(value);
  return true;
}
export function setTeacherSubstitutive({ courseCode, section, studentId, value }) {
  if (!teacherGradesByCourse[courseCode]) teacherGradesByCourse[courseCode] = {};
  if (!teacherGradesByCourse[courseCode][section]) teacherGradesByCourse[courseCode][section] = {};
  if (!teacherGradesByCourse[courseCode][section][studentId]) {
    teacherGradesByCourse[courseCode][section][studentId] = {
      P1: { continuous: 0, exam: 0 },
      P2: { continuous: 0, exam: 0 },
      P3: { continuous: 0, exam: 0 },
      substitutive: null,
    };
  }
  teacherGradesByCourse[courseCode][section][studentId].substitutive = value == null ? null : Number(value);
  return true;
}
export function getTeacherGradesSummary(courseCode, section, catalog = coursesById) {
  const sectionGrades = getTeacherGrades(courseCode, section);
  const entries = Object.entries(sectionGrades);
  return entries.map(([studentId, g]) => {
    const calc = computeCourseFinalForStudent(courseCode, g, catalog);
    const roster = getTeacherRoster(courseCode, section);
    const student = roster.find((s) => s.id === studentId);
    return {
      studentId,
      studentName: student?.name ?? studentId,
      partials: { P1: g.P1, P2: g.P2, P3: g.P3 },
      substitutive: g.substitutive ?? null,
      computed: calc,
    };
  });
}
// Rooms (unchanged)
export const rooms = [
  { id: 'room1', name: 'Laboratorio 1', capacity: 30 },
  { id: 'room2', name: 'Sala de Conferencias', capacity: 50 },
  { id: 'room3', name: 'Aula Magna', capacity: 100 },
];
// API-like functions for mocks
export async function mockGetTeacherProfile() {
  return structuredClone(teacherProfile);
}
export async function mockGetTeacherSchedule() {
  return getTeacherSchedule();
}
export async function mockGetTeacherRoster(courseCode, section) {
  return structuredClone(getTeacherRoster(courseCode, section));
}
export async function mockOpenAttendanceSession(args) {
  return openAttendanceSession(args);
}
export async function mockMarkAttendance(args) {
  return markAttendance(args);
}
export async function mockCloseAttendanceSession(sessionId) {
  return closeAttendanceSession(sessionId);
}
export async function mockListAttendanceSessions(filter) {
  return structuredClone(listAttendanceSessions(filter));
}
export async function mockGetTeacherGrades(courseCode, section) {
  return structuredClone(getTeacherGrades(courseCode, section));
}
export async function mockSetTeacherGrade(payload) {
  return setTeacherGrade(payload);
}
export async function mockSetTeacherSubstitutive(payload) {
  return setTeacherSubstitutive(payload);
}
export async function mockGetTeacherGradesSummary(courseCode, section) {
  return structuredClone(getTeacherGradesSummary(courseCode, section));
}
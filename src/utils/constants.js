// Definición de constantes para rutas, roles y utilidades varias.

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  // Rutas de estudiante
  STUDENT_DASHBOARD: '/estudiante',
  STUDENT_SCHEDULE: '/estudiante/horario',
  STUDENT_GRADES: '/estudiante/notas',
  STUDENT_LABS: '/estudiante/laboratorios',
  // Rutas de docente
  TEACHER_DASHBOARD: '/docente',
  TEACHER_ATTENDANCE: '/docente/asistencia',
  TEACHER_GRADES: '/docente/notas',
  TEACHER_SCHEDULE: '/docente/horario',
  TEACHER_ROOMS: '/docente/ambientes',
};

// Días de la semana en español para ordenar horarios
export const DAYS = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
};

export const ACADEMIC_HOURS = {
  1: { start: '07:00', end: '07:50' },
  2: { start: '07:50', end: '08:40' },
  3: { start: '08:50', end: '09:40' },
  4: { start: '09:40', end: '10:30' },
  5: { start: '10:40', end: '11:30' },
  6: { start: '11:30', end: '12:20' },
  7: { start: '12:20', end: '13:10' },
  8: { start: '13:10', end: '14:00' },
  9: { start: '14:00', end: '14:50' },
  10: { start: '14:50', end: '15:40' },
  11: { start: '15:50', end: '16:40' },
  12: { start: '16:40', end: '17:30' },
  13: { start: '17:40', end: '18:30' },
  14: { start: '18:30', end: '19:20' },
  15: { start: '19:20', end: '20:10' }
};


export const DAY_INDEX = {
  'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 
  'Thursday': 4, 'Friday': 5
};
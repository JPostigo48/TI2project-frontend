// Definición de constantes para rutas, roles y utilidades varias.

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  SECRETARY: 'secretary',
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
  // Administrador
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/usuarios',
  ADMIN_SEMESTERS: '/admin/semestres',
  ADMIN_ROOMS: '/admin/aulas',
  ADMIN_SETTINGS: '/admin/configuracion',
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
  1: { label: '1ra', start: '07:00', end: '07:50' },
  2: { label: '2da', start: '07:50', end: '08:40' },
  3: { label: '3ra', start: '08:50', end: '09:40' },
  4: { label: '4ta', start: '09:40', end: '10:30' },
  5: { label: '5ta', start: '10:40', end: '11:30' },
  6: { label: '6ta', start: '11:30', end: '12:20' },
  7: { label: '7ma', start: '12:20', end: '13:10' },
  8: { label: '8va', start: '13:10', end: '14:00' },
  9: { label: '9na', start: '14:00', end: '14:50' },
  10: { label: '10ma', start: '14:50', end: '15:40' },
  11: { label: '11ra', start: '15:50', end: '16:40' },
  12: { label: '12da', start: '16:40', end: '17:30' },
  13: { label: '13ra', start: '17:40', end: '18:30' },
  14: { label: '14ta', start: '18:30', end: '19:20' },
  15: { label: '15ta', start: '19:20', end: '20:10' }
};

export const ACADEMIC_HOUR_OPTIONS = Object.entries(ACADEMIC_HOURS).map(
  ([value, info]) => ({
    value: Number(value),
    label: info.label,
  })
);

export const DAY_INDEX = {
  'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 
  'Thursday': 4, 'Friday': 5
};
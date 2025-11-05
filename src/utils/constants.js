// Definición de constantes para rutas, roles y utilidades varias.

export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
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

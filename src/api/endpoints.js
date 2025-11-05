/**
 * Definición de endpoints para las peticiones HTTP.  Estos valores
 * son utilizados por los servicios para construir las rutas de API
 * cuando `VITE_USE_MOCK_DATA` es `false`.  Se utiliza como base la
 * configuración de `axiosClient`, por lo que los endpoints se
 * concatenan directamente.
 */
const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    RECOVER_PASSWORD: '/auth/recover',
  },
  STUDENT: {
    SCHEDULE: '/student/schedule',
    GRADES: '/student/grades',
    LABS: '/student/labs',
    ENROLL: '/student/labs/enroll',
  },
  TEACHER: {
    SCHEDULE: '/teacher/schedule',
    ATTENDANCE_LIST: '/teacher/attendance-list',
    SUBMIT_ATTENDANCE: '/teacher/attendance',
    GRADES: '/teacher/grades',
    UPDATE_GRADE: '/teacher/grades/update',
    ROOMS: '/teacher/rooms',
    RESERVE_ROOM: '/teacher/rooms/reserve',
  },
};

export default ENDPOINTS;

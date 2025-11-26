const ENDPOINTS = {
  AUTH: {
    /**
     * Iniciar sesión: envía un email y contraseña y devuelve un token
     * JWT junto con datos básicos del usuario. Corresponde a
     * `POST /auth/login` en el backend.
     */
    LOGIN: '/auth/login',
    /**
     * Cerrar sesión: el backend puede invalidar el token. El
     * controlador de frontend también limpiará la sesión local.
     * Corresponde a `POST /auth/logout` (opcional en el backend).
     */
    LOGOUT: '/auth/logout',
    /**
     * Recuperar contraseña: permite solicitar un restablecimiento de
     * contraseña. Corresponde a `POST /auth/recover`.
     */
    RECOVER_PASSWORD: '/auth/recover',
  },
  STUDENT: {
    PROFILE: '/users',
    SCHEDULE: '/courses',
    GRADES: '/grades',
    LABS: '/labs/groups',
    ENROLL: '/labs/preferences',
    SUMMARY: '/student/summary', 
  },
  TEACHER: {
    SCHEDULE: '/courses',
    ATTENDANCE_LIST: '/attendance',
    SUBMIT_ATTENDANCE: '/attendance',
    GRADES: '/grades',
    UPDATE_GRADE: '/grades',
    ROOMS: '/rooms',
    RESERVE_ROOM: '/rooms/reserve',
    ROOM_RESERVATIONS: '/rooms/reservations',
  },
};

export default ENDPOINTS;
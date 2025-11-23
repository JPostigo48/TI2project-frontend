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
    /**
     * Perfil del usuario. La ruta final se construye en el servicio
     * usando el id del usuario (`/users/:id`). Aquí solo se define
     * la base (`/users`).
     */
    PROFILE: '/users',
    /**
     * Endpoints para obtener la lista de cursos. Se puede filtrar por
     * `studentId` usando parámetros de consulta. Corresponde a
     * `GET /courses`.
     */
    SCHEDULE: '/courses',
    /**
     * Endpoints de calificaciones. Se utiliza con parámetros de
     * consulta como `section`, `studentId` y `summary`.
     * Corresponde a `GET /grades` y `POST /grades`.
     */
    GRADES: '/grades',
    /**
     * Lista de grupos de laboratorio disponibles. Admite filtros por
     * curso y semestre. Corresponde a `GET /labs/groups`.
     */
    LABS: '/labs/groups',
    /**
     * Registrar preferencias o inscripción a laboratorios. Corresponde
     * a `POST /labs/preferences`.
     */
    ENROLL: '/labs/preferences',
  },
  TEACHER: {
    /**
     * Lista de cursos. Puede filtrarse por `teacherId` para obtener
     * únicamente los cursos que dicta el docente. Corresponde a
     * `GET /courses`.
     */
    SCHEDULE: '/courses',
    /**
     * Asistencia: permite abrir nuevas sesiones (POST) o consultar
     * sesiones existentes (GET) con parámetros de filtrado. Equivale a
     * las rutas `/attendance` del backend.
     */
    ATTENDANCE_LIST: '/attendance',
    /**
     * Crear o actualizar una sesión de asistencia. En el backend se
     * utiliza la misma ruta que la consulta (`/attendance`), pero con
     * el método POST. Este alias se mantiene por compatibilidad con el
     * código existente.
     */
    SUBMIT_ATTENDANCE: '/attendance',
    /**
     * Notas: se usa para obtener o actualizar calificaciones según
     * método (GET para consultar, POST para crear/actualizar). Se
     * admite `section` y `summary` como parámetros. Corresponde a
     * `/grades`.
     */
    GRADES: '/grades',
    UPDATE_GRADE: '/grades',
    /**
     * Aulas y reservas de aulas. `GET /rooms` devuelve la lista de
     * aulas y `POST /rooms/reserve` crea una nueva reserva.
     */
    ROOMS: '/rooms',
    RESERVE_ROOM: '/rooms/reserve',
    /**
     * Consultar reservas existentes: acepta parámetros `room` y
     * `date` para filtrar. Corresponde a `GET /rooms/reservations`.
     */
    ROOM_RESERVATIONS: '/rooms/reservations',
  },
};

export default ENDPOINTS;
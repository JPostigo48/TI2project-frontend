const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    RECOVER_PASSWORD: '/auth/recover',
  },
  STUDENT: {
    PROFILE: '/users',
    SCHEDULE: '/student/schedule',
    GRADES: '/grades',
    LABS: '/lab/groups',
    ENROLL: '/lab/preferences',
    SUMMARY: '/student/summary', 
  },
  TEACHER: {
    SCHEDULE: '/teacher/schedule',
    ATTENDANCE_LIST: '/attendance',
    SUBMIT_ATTENDANCE: '/attendance',
    GRADES: '/grades',
    UPDATE_GRADE: '/grades/update',
    ROOMS: '/rooms',
    RESERVE_ROOM: '/rooms/reserve',
    ROOM_RESERVATIONS: '/rooms/reservations',
  },
  ADMIN: {
    // adminRoutes
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USERS_RESET_PASSWORD: (id) => `/admin/users/${id}/reset-password`,

    // authRoutes
    REGISTER_USER: '/auth/register',

    SETTINGS: '/admin/settings',
    SECTIONS_IN_COURSE: (id) => `/courses/${id}/sections`,
  },
  COMMON: {
    USERS: '/users',

    SEMESTERS: '/semester/list',
    SEMESTER_CREATE: '/semester/create',
    SEMESTER_EDIT: (id) => `/semester/${id}/edit`,

    SEMESTER_LAB_OPEN: (id) => `/semester/${id}/labs/open`,
    SEMESTER_LAB_CLOSE: (id) => `/semester/${id}/labs/close`,
    SEMESTER_LAB_PREPROCESS: (id) => `/semester/${id}/labs/preprocess`,
    SEMESTER_LAB_PROCESS: (id) => `/semester/${id}/labs/process`,
    SEMESTER_LAB_RESULTS: (id) => `/semester/${id}/labs/results`,

    COURSE_EDIT: (id) => `/sections/${id}/edit`,

    ROOMS: '/rooms',
  },
};

export default ENDPOINTS;
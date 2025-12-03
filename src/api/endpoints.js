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
    UPDATE_GRADE: '/grades',
    ROOMS: '/rooms',
    RESERVE_ROOM: '/rooms/reserve',
    ROOM_RESERVATIONS: '/rooms/reservations',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
  COMMON: {
    USERS: '/users',
    SEMESTERS: '/semesters',
    ROOMS: '/rooms',
  },
};

export default ENDPOINTS;
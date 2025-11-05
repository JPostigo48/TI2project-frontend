/**
 * Mocks para operaciones del docente.
 */

// Lista de alumnos para asistencia
const attendanceList = [
  { id: 'stu1', code: '20201234', name: 'Carlos Gómez' },
  { id: 'stu2', code: '20205678', name: 'Ana Martínez' },
  { id: 'stu3', code: '20207890', name: 'Luis Rodríguez' },
];

// Horario del docente
const teacherSchedule = [
  {
    id: 'tcs1',
    courseName: 'Algoritmos y Estructuras de Datos',
    courseCode: 'CS101',
    section: 'A',
    day: 'Lunes',
    startTime: '08:00',
    endTime: '10:00',
    room: 'Aula 101',
    studentCount: 30,
  },
  {
    id: 'tcs2',
    courseName: 'Base de Datos II',
    courseCode: 'CS202',
    section: 'B',
    day: 'Martes',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Laboratorio 3',
    studentCount: 25,
  },
  {
    id: 'tcs3',
    courseName: 'Trabajo Interdisciplinar II',
    courseCode: 'CS303',
    section: 'A',
    day: 'Viernes',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Aula 205',
    studentCount: 28,
  },
];

// Notas de alumnos gestionadas por el docente
let teacherGrades = [
  { id: 'tg1', student: 'Carlos Gómez', evaluation: 'Examen 1', score: 15 },
  { id: 'tg2', student: 'Ana Martínez', evaluation: 'Examen 1', score: 18 },
  { id: 'tg3', student: 'Luis Rodríguez', evaluation: 'Examen 1', score: 12 },
];

// Ambientes disponibles
const rooms = [
  { id: 'room1', name: 'Laboratorio 1', capacity: 30 },
  { id: 'room2', name: 'Sala de Conferencias', capacity: 50 },
  { id: 'room3', name: 'Aula Magna', capacity: 100 },
];

export async function mockGetAttendanceList() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return attendanceList;
}

export async function mockSubmitAttendance(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // No se realiza almacenamiento real; se asume éxito
  return { success: true, message: 'Asistencia guardada' };
}

export async function mockGetTeacherSchedule() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return teacherSchedule;
}

export async function mockGetTeacherGrades() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return teacherGrades;
}

export async function mockUpdateGrade(gradeId, newScore) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const grade = teacherGrades.find((g) => g.id === gradeId);
  if (grade) {
    grade.score = Number(newScore);
    return { success: true };
  }
  return { success: false, message: 'Nota no encontrada' };
}

export async function mockGetRooms() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return rooms;
}

export async function mockReserveRoom(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // No se verifica disponibilidad; se asume éxito
  return { success: true, message: 'Reserva exitosa' };
}

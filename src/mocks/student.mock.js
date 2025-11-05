/**
 * Mocks para operaciones del estudiante.
 */

// Horario ficticio para el estudiante
const schedule = [
  {
    id: 'cs1',
    courseName: 'Algoritmos y Estructuras de Datos',
    courseCode: 'CS101',
    section: 'A',
    day: 'Lunes',
    startTime: '08:00',
    endTime: '10:00',
    room: 'Aula 101',
    teacher: 'Ing. Ramos',
  },
  {
    id: 'cs2',
    courseName: 'Base de Datos II',
    courseCode: 'CS202',
    section: 'B',
    day: 'Martes',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Laboratorio 3',
    teacher: 'Mg. Torres',
  },
  {
    id: 'cs3',
    courseName: 'Trabajo Interdisciplinar II',
    courseCode: 'CS303',
    section: 'A',
    day: 'Viernes',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Aula 205',
    teacher: 'Dr. Gonzales',
  },
];

// Notas ficticias para el estudiante
const grades = [
  {
    id: 'g1',
    course: 'Algoritmos y Estructuras de Datos',
    evaluation: 'Examen Parcial',
    score: 16,
  },
  {
    id: 'g2',
    course: 'Base de Datos II',
    evaluation: 'Proyecto Final',
    score: 18,
  },
  {
    id: 'g3',
    course: 'Trabajo Interdisciplinar II',
    evaluation: 'Examen Parcial',
    score: 14,
  },
];

// Laboratorios disponibles
let labs = [
  {
    id: 'lab1',
    name: 'Laboratorio de Estructuras',
    day: 'Lunes',
    time: '12:00 - 14:00',
    capacity: 20,
    enrolled: 10,
  },
  {
    id: 'lab2',
    name: 'Laboratorio de Base de Datos',
    day: 'Martes',
    time: '14:00 - 16:00',
    capacity: 25,
    enrolled: 24,
  },
  {
    id: 'lab3',
    name: 'Laboratorio de Redes',
    day: 'Miércoles',
    time: '08:00 - 10:00',
    capacity: 15,
    enrolled: 8,
  },
];

export async function mockGetSchedule() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return schedule;
}

export async function mockGetGrades() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return grades;
}

export async function mockGetLabs() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return labs;
}

export async function mockEnrollLab(labId) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const lab = labs.find((l) => l.id === labId);
  if (lab) {
    if (lab.enrolled < lab.capacity) {
      lab.enrolled += 1;
      return { success: true, message: 'Inscripción exitosa' };
    }
    return { success: false, message: 'No hay cupos disponibles' };
  }
  return { success: false, message: 'Laboratorio no encontrado' };
}

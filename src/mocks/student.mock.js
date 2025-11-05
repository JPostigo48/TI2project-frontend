// src/mocks/student.mock.js

// Catálogo de cursos con bloques de horario y esquemas de evaluación
export const coursesById = {
  CS101: {
    code: 'CS101',
    name: 'Algoritmos y Estructuras de Datos',
    sections: ['A', 'B'],
    scheduleBlocks: [
      { day: 'Monday', startTime: '08:50', endTime: '10:30', room: 'Aula 101', teacher: 'Ing. Ramos' },
      { day: 'Thursday', startTime: '14:00', endTime: '15:40', room: 'Aula 205', teacher: 'Ing. Ramos' },
      { day: 'Friday', startTime: '14:00', endTime: '15:40', room: 'Aula 205', teacher: 'Ing. Ramos' },
    ],
    evaluationScheme: {
      partials: {
        P1: { weights: { continuous: 0.4, exam: 0.6 } },
        P2: { weights: { continuous: 0.4, exam: 0.6 } },
        P3: { weights: { continuous: 0.4, exam: 0.6 } },
      },
      finalWeights: { P1: 1 / 3, P2: 1 / 3, P3: 1 / 3 },
      hasSubstitutive: true,
      substitutiveReplaces: 'minExamOfP1P2',
    },
  },
  CS202: {
    code: 'CS202',
    name: 'Base de Datos II',
    sections: ['A', 'B'],
    scheduleBlocks: [
      { day: 'Tuesday', startTime: '10:30', endTime: '12:20', room: 'Laboratorio 3', teacher: 'Mg. Torres' },
    ],
    evaluationScheme: {
      partials: {
        P1: { weights: { continuous: 0.5, exam: 0.5 } },
        P2: { weights: { continuous: 0.4, exam: 0.6 } },
        P3: { weights: { continuous: 0.4, exam: 0.6 } },
      },
      finalWeights: { P1: 0.3, P2: 0.35, P3: 0.35 },
      hasSubstitutive: true,
      substitutiveReplaces: 'minExamOfP1P2',
    },
  },
  CS303: {
    code: 'CS303',
    name: 'Trabajo Interdisciplinar II',
    sections: ['A'],
    scheduleBlocks: [
      { day: 'Friday', startTime: '14:00', endTime: '15:40', room: 'Aula 205', teacher: 'Dr. Gonzales' },
    ],
    evaluationScheme: {
      partials: {
        P1: { weights: { continuous: 0.4, exam: 0.6 } },
        P2: { weights: { continuous: 0.4, exam: 0.6 } },
        P3: { weights: { continuous: 0.4, exam: 0.6 } },
      },
      finalWeights: { P1: 0.3, P2: 0.4, P3: 0.3 },
      hasSubstitutive: true,
      substitutiveReplaces: 'minExamOfP1P2',
    },
  },
};

// Grupos de laboratorio disponibles (asociados a cada curso)
export const labGroups = [
  { id: 'CS101-A', courseCode: 'CS101', group: 'A', day: 'Monday', startTime: '12:00', endTime: '14:00', capacity: 20, enrolled: 10, room: 'Lab Alg 1' },
  { id: 'CS101-B', courseCode: 'CS101', group: 'B', day: 'Wednesday', startTime: '08:00', endTime: '10:00', capacity: 20, enrolled: 8, room: 'Lab Alg 2' },
  { id: 'CS202-A', courseCode: 'CS202', group: 'A', day: 'Tuesday', startTime: '14:00', endTime: '16:00', capacity: 25, enrolled: 24, room: 'Lab BD 1' },
  { id: 'CS202-B', courseCode: 'CS202', group: 'B', day: 'Thursday', startTime: '10:00', endTime: '12:00', capacity: 25, enrolled: 12, room: 'Lab BD 2' },
  { id: 'CS303-A', courseCode: 'CS303', group: 'A', day: 'Friday', startTime: '08:00', endTime: '10:00', capacity: 15, enrolled: 8, room: 'Lab TI 1' },
];

// Perfil del alumno: cursos inscritos y notas por parcial
export const studentProfile = {
  id: 'stu-001',
  code: '20240001',
  name: 'Juan Pérez',
  role: 'STUDENT',
  enrollments: [
    { courseCode: 'CS101', section: 'A' },
    { courseCode: 'CS202', section: 'B' },
    { courseCode: 'CS303', section: 'A' },
  ],
  grades: {
    CS101: {
      P1: { continuous: 15, exam: 16 },
      P2: { continuous: 14, exam: 17 },
      P3: { continuous: 16, exam: 15 },
      substitutive: null,
    },
    CS202: {
      P1: { continuous: 16, exam: 17 },
      P2: { continuous: 15, exam: 12 },
      P3: { continuous: 18, exam: 19 },
      substitutive: 15,
    },
    CS303: {
      P1: { continuous: 14, exam: 14 },
      P2: { continuous: 15, exam: 15 },
      P3: { continuous: 16, exam: 16 },
      substitutive: null,
    },
  },
  labPreferences: [
    { courseCode: 'CS101', preferences: ['CS101-B', 'CS101-A'] },
    { courseCode: 'CS202', preferences: ['CS202-B', 'CS202-A'] },
  ],
};

// Utilidades para calcular parciales y nota final
function computePartialScore(partial, weights) {
  const c = Number(partial?.continuous ?? 0);
  const e = Number(partial?.exam ?? 0);
  return c * (weights.continuous ?? 0) + e * (weights.exam ?? 0);
}
function computeCourseFinal(courseCode, profile = studentProfile, catalog = coursesById) {
  const scheme = catalog[courseCode]?.evaluationScheme;
  const g = profile.grades?.[courseCode];
  if (!scheme || !g) return null;

  let P1 = computePartialScore(g.P1, scheme.partials.P1.weights);
  let P2 = computePartialScore(g.P2, scheme.partials.P2.weights);
  const P3 = computePartialScore(g.P3, scheme.partials.P3.weights);

  // Regla de sustitutorio: reemplaza el menor examen entre P1 y P2 si mejora
  if (scheme.hasSubstitutive && g.substitutive != null && scheme.substitutiveReplaces === 'minExamOfP1P2') {
    const exam1 = Number(g.P1?.exam ?? 0);
    const exam2 = Number(g.P2?.exam ?? 0);
    const minExam = Math.min(exam1, exam2);
    if (g.substitutive > minExam) {
      if (exam1 <= exam2) {
        const newP1 = { ...g.P1, exam: g.substitutive };
        P1 = computePartialScore(newP1, scheme.partials.P1.weights);
      } else {
        const newP2 = { ...g.P2, exam: g.substitutive };
        P2 = computePartialScore(newP2, scheme.partials.P2.weights);
      }
    }
  }
  const fw = scheme.finalWeights;
  const finalScore = P1 * fw.P1 + P2 * fw.P2 + P3 * fw.P3;
  return { P1, P2, P3, finalScore };
}

// Construye el horario semanal del alumno a partir de sus matriculas
export function getStudentSchedule(profile = studentProfile, catalog = coursesById) {
  const blocks = [];
  for (const enr of profile.enrollments) {
    const course = catalog[enr.courseCode];
    if (!course) continue;
    for (const b of course.scheduleBlocks) {
      blocks.push({
        id: `${enr.courseCode}-${enr.section}-${b.day}-${b.startTime}`,
        courseCode: enr.courseCode,
        courseName: course.name,
        section: enr.section,
        day: b.day,
        startTime: b.startTime,
        endTime: b.endTime,
        room: b.room,
        teacher: b.teacher,
      });
    }
  }
  return blocks;
}

// Devuelve resumen de notas (parciales, sustitutorio y nota final)
export function getStudentGradesSummary(profile = studentProfile, catalog = coursesById) {
  return profile.enrollments.map(({ courseCode }) => {
    const course = catalog[courseCode];
    const calc = computeCourseFinal(courseCode, profile, catalog);
    return {
      courseCode,
      courseName: course?.name,
      partials: {
        P1: profile.grades[courseCode]?.P1 ?? null,
        P2: profile.grades[courseCode]?.P2 ?? null,
        P3: profile.grades[courseCode]?.P3 ?? null,
      },
      substitutive: profile.grades[courseCode]?.substitutive ?? null,
      computed: calc,
    };
  });
}

// Filtra grupos de laboratorio disponibles para los cursos matriculados
export function getAvailableLabGroupsForStudent(profile = studentProfile, groups = labGroups) {
  const enrolledSet = new Set(profile.enrollments.map((e) => e.courseCode));
  return groups.filter((g) => enrolledSet.has(g.courseCode));
}

// Funciones mock tipo “API”
export async function mockGetStudentProfile() {
  return structuredClone(studentProfile);
}
export async function mockGetStudentSchedule() {
  return getStudentSchedule();
}
export async function mockGetStudentGrades() {
  return getStudentGradesSummary();
}
export async function mockGetAvailableLabs() {
  return getAvailableLabGroupsForStudent();
}

// --- Course catalog with schedule blocks and evaluation scheme ---
export const coursesById = {
  CS101: {
    code: 'CS101',
    name: 'Algoritmos y Estructuras de Datos',
    sections: ['A', 'B'],
    // Multiple schedule blocks per course (theory or mandatory sessions)
    scheduleBlocks: [
      // Lunes 08:00-10:00
      { day: 'Monday', startTime: '08:00', endTime: '10:00', room: 'Aula 101', teacher: 'Ing. Ramos' },
      // Jueves 14:00-16:00
      { day: 'Thursday', startTime: '14:00', endTime: '16:00', room: 'Aula 205', teacher: 'Ing. Ramos' },
      // Viernes 14:00-16:00
      { day: 'Friday', startTime: '14:00', endTime: '16:00', room: 'Aula 205', teacher: 'Ing. Ramos' },
    ],
    // Evaluation scheme: 3 partials; each partial = continuous + exam; substitutive can replace min(exam1, exam2)
    evaluationScheme: {
      partials: {
        P1: { weights: { continuous: 0.4, exam: 0.6 } },
        P2: { weights: { continuous: 0.4, exam: 0.6 } },
        P3: { weights: { continuous: 0.4, exam: 0.6 } },
      },
      finalWeights: { P1: 1 / 3, P2: 1 / 3, P3: 1 / 3 }, // average of partials (example)
      hasSubstitutive: true,
      substitutiveReplaces: 'minExamOfP1P2', // business rule
    },
  },
  CS202: {
    code: 'CS202',
    name: 'Base de Datos II',
    sections: ['A', 'B'],
    scheduleBlocks: [
      { day: 'Tuesday', startTime: '10:00', endTime: '12:00', room: 'Laboratorio 3', teacher: 'Mg. Torres' },
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
      { day: 'Friday', startTime: '14:00', endTime: '16:00', room: 'Aula 205', teacher: 'Dr. Gonzales' },
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

// --- Lab groups (only courses the student is enrolled in should appear) ---
export const labGroups = [
  // Typical: 2 groups (A, B); could be 1 or 3+
  { id: 'CS101-A', courseCode: 'CS101', group: 'A', day: 'Monday', startTime: '12:00', endTime: '14:00', capacity: 20, enrolled: 10, room: 'Lab Alg 1' },
  { id: 'CS101-B', courseCode: 'CS101', group: 'B', day: 'Wednesday', startTime: '08:00', endTime: '10:00', capacity: 20, enrolled: 8, room: 'Lab Alg 2' },

  { id: 'CS202-A', courseCode: 'CS202', group: 'A', day: 'Tuesday', startTime: '14:00', endTime: '16:00', capacity: 25, enrolled: 24, room: 'Lab BD 1' },
  { id: 'CS202-B', courseCode: 'CS202', group: 'B', day: 'Thursday', startTime: '10:00', endTime: '12:00', capacity: 25, enrolled: 12, room: 'Lab BD 2' },

  { id: 'CS303-A', courseCode: 'CS303', group: 'A', day: 'Friday', startTime: '08:00', endTime: '10:00', capacity: 15, enrolled: 8, room: 'Lab TI 1' },
];

// --- Student profile with enrollments, schedule derived from course scheduleBlocks, and grades ---
export const studentProfile = {
  id: 'stu-001',
  code: '20240001',
  name: 'Juan Pérez',
  role: 'STUDENT',
  // Which courses and sections the student is actually enrolled in
  enrollments: [
    { courseCode: 'CS101', section: 'A' },
    { courseCode: 'CS202', section: 'B' },
    { courseCode: 'CS303', section: 'A' },
  ],
  // Grades per course (3 partials: continuous + exam; optional substitutive after P2)
  grades: {
    CS101: {
      P1: { continuous: 15, exam: 16 },
      P2: { continuous: 14, exam: 17 },
      P3: { continuous: 16, exam: 15 },
      substitutive: null, // e.g. 18 would replace the min(exam P1,P2) if greater
    },
    CS202: {
      P1: { continuous: 16, exam: 17 },
      P2: { continuous: 15, exam: 12 }, // weaker exam
      P3: { continuous: 18, exam: 19 },
      substitutive: 15, // replaces min(exam P1,P2) = 12 -> becomes 15 if rule applies
    },
    CS303: {
      P1: { continuous: 14, exam: 14 },
      P2: { continuous: 15, exam: 15 },
      P3: { continuous: 16, exam: 16 },
      substitutive: null,
    },
  },
  // Optional: student's lab preferences (by labGroup id, ordered)
  labPreferences: [
    { courseCode: 'CS101', preferences: ['CS101-B', 'CS101-A'] },
    { courseCode: 'CS202', preferences: ['CS202-B', 'CS202-A'] },
  ],
};

// --- Utility: build student's weekly schedule from coursesById and enrollments ---
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

// --- Utility: compute partial score from (continuous, exam) and weights ---
export function computePartialScore(partial, weights) {
  const c = Number(partial?.continuous ?? 0);
  const e = Number(partial?.exam ?? 0);
  return c * (weights.continuous ?? 0) + e * (weights.exam ?? 0);
}

// --- Utility: compute final per course with substitutive rule ---
export function computeCourseFinal(courseCode, profile = studentProfile, catalog = coursesById) {
  const scheme = catalog[courseCode]?.evaluationScheme;
  const g = profile.grades?.[courseCode];
  if (!scheme || !g) return null;

  let P1 = computePartialScore(g.P1, scheme.partials.P1.weights);
  let P2 = computePartialScore(g.P2, scheme.partials.P2.weights);
  const P3 = computePartialScore(g.P3, scheme.partials.P3.weights);

  // Apply substitutive rule if any
  if (scheme.hasSubstitutive && g.substitutive != null && scheme.substitutiveReplaces === 'minExamOfP1P2') {
    const exam1 = Number(g.P1?.exam ?? 0);
    const exam2 = Number(g.P2?.exam ?? 0);
    const minExam = Math.min(exam1, exam2);
    if (g.substitutive > minExam) {
      // Replace only the exam component of the *partial* that had the min exam, then recompute that partial
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
  const finalScore = (P1 * fw.P1) + (P2 * fw.P2) + (P3 * fw.P3);
  return { P1, P2, P3, finalScore };
}

// --- Utility: return all courses with computed finals for the student ---
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
      computed: calc, // includes finalScore
    };
  });
}

// --- Utility: filter lab groups available for the student's enrolled courses ---
export function getAvailableLabGroupsForStudent(profile = studentProfile, allGroups = labGroups) {
  const enrolledSet = new Set(profile.enrollments.map((e) => e.courseCode));
  return allGroups.filter(g => enrolledSet.has(g.courseCode));
}

// --- Mock “API” for the frontend (promise-based) ---
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

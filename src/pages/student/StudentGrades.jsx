import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { calculateStats } from '../../utils/helpers';

const StudentGrades = () => {
  const {
    data: gradesRaw = [],
    isLoading: loadingGrades,
    error: errorGrades,
  } = useQuery({
    queryKey: ['studentGrades'],
    queryFn: () => StudentService.getGrades(),
  });

  const {
    data: scheduleBlocks = [],
    isLoading: loadingSchedule,
    error: errorSchedule,
  } = useQuery({
    queryKey: ['studentSchedule'],
    queryFn: () => StudentService.getSchedule(),
  });

  if (loadingGrades || loadingSchedule) {
    return <LoadingSpinner message="Cargando notas..." />;
  }

  if (errorGrades || errorSchedule) {
    return <ErrorMessage message="Error al cargar notas u horario" />;
  }

  const courseMap = {};

  if (Array.isArray(scheduleBlocks)) {
    scheduleBlocks.forEach((b) => {
      if (!b || !b.courseCode) return;
      const key = `${b.courseCode}-${b.group || ''}`;
      if (!courseMap[key]) {
        courseMap[key] = {
          courseCode: b.courseCode,
          courseName: b.courseName,
          group: b.group,
          partials: {},
          substitutive: null,
          computed: {},
        };
      }
    });
  }

  if (Array.isArray(gradesRaw)) {
    gradesRaw.forEach((g) => {
      if (!g || !g.courseCode) return;
      const key = `${g.courseCode}-${g.group || ''}`;
      if (!courseMap[key]) {
        courseMap[key] = {
          courseCode: g.courseCode,
          courseName: g.courseName,
          group: g.group,
          partials: {},
          substitutive: null,
          computed: {},
        };
      }
      courseMap[key].partials = g.partials || {};
      courseMap[key].substitutive =
        g.substitutive !== undefined ? g.substitutive : courseMap[key].substitutive;
      courseMap[key].computed = g.computed || {};
    });
  }

  const rows = Object.values(courseMap);

  if (rows.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-semibold">Mis Notas</h1>
        <p className="card">No hay cursos matriculados ni notas registradas.</p>
      </div>
    );
  }

  const finals = rows.map((g) => g.computed?.finalScore ?? 0);
  const stats = calculateStats(finals);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-semibold">Mis Notas</h1>
      <div className="flex gap-3">
        <div className="card">Promedio: {stats.avg}</div>
        <div className="card">Máxima: {stats.max}</div>
        <div className="card">Mínima: {stats.min}</div>
      </div>
      <table className="w-full border divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="p-2">Curso</th>
            <th className="p-2">Grupo</th>
            <th className="p-2">P1 Cont.</th>
            <th className="p-2">P1 Exam.</th>
            <th className="p-2">P2 Cont.</th>
            <th className="p-2">P2 Exam.</th>
            <th className="p-2">P3 Cont.</th>
            <th className="p-2">P3 Exam.</th>
            <th className="p-2">Sustit.</th>
            <th className="p-2">Final</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={`${g.courseCode}-${g.group || ''}`} className="text-sm hover:bg-gray-50">
              <td className="p-2 font-medium">
                {g.courseName} ({g.courseCode})
              </td>
              <td className="p-2">{g.group || '-'}</td>
              <td className="p-2">{g.partials?.P1?.continuous ?? '-'}</td>
              <td className="p-2">{g.partials?.P1?.exam ?? '-'}</td>
              <td className="p-2">{g.partials?.P2?.continuous ?? '-'}</td>
              <td className="p-2">{g.partials?.P2?.exam ?? '-'}</td>
              <td className="p-2">{g.partials?.P3?.continuous ?? '-'}</td>
              <td className="p-2">{g.partials?.P3?.exam ?? '-'}</td>
              <td className="p-2">{g.substitutive ?? '-'}</td>
              <td className="p-2 font-semibold">
                {g.computed?.finalScore !== undefined
                  ? g.computed.finalScore.toFixed(2)
                  : '0.00'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrades;

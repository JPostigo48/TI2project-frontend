// src/pages/student/StudentGrades.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { calculateStats } from '../../utils/helpers';

const StudentGrades = () => {
  const { data: grades, isLoading, error } = useQuery({
    queryKey: ['studentGrades'],
    queryFn: () => StudentService.getGrades(),
  });

  if (isLoading) return <LoadingSpinner message="Cargando notas..." />;
  if (error) return <ErrorMessage message="Error al cargar notas" />;

  // Extraer las notas finales para estadísticas
  const finals = grades.map(g => g.computed.finalScore ?? 0);
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
          {grades.map((g) => (
            <tr key={g.courseCode} className="text-sm hover:bg-gray-50">
              <td className="p-2 font-medium">{g.courseName}</td>
              <td className="p-2">{g.partials.P1?.continuous}</td>
              <td className="p-2">{g.partials.P1?.exam}</td>
              <td className="p-2">{g.partials.P2?.continuous}</td>
              <td className="p-2">{g.partials.P2?.exam}</td>
              <td className="p-2">{g.partials.P3?.continuous}</td>
              <td className="p-2">{g.partials.P3?.exam}</td>
              <td className="p-2">{g.substitutive ?? '-'}</td>
              <td className="p-2 font-semibold">{g.computed.finalScore?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrades;

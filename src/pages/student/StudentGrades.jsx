import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import ErrorMessage from '../../components/shared/ErrorMessage';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { calculateStats } from '../../utils/helpers';

const StudentGrades = () => {
  const {
    data: grades = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['student-grades'],
    queryFn: () => StudentService.getGrades(),
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando notas..." />;
  }
  if (error) {
    return <ErrorMessage message={error.message || 'Error al cargar las notas'} />;
  }

  const scores = grades.map((g) => g.score);
  const stats = calculateStats(scores);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Mis Notas</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-green-600 mb-1">Promedio</p>
          <p className="text-3xl font-bold text-green-700">{stats.avg}</p>
        </div>
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Mayor</p>
          <p className="text-3xl font-bold text-blue-700">{stats.max}</p>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Menor</p>
          <p className="text-3xl font-bold text-purple-700">{stats.min}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Curso</th>
              <th className="px-4 py-2 text-left text-gray-600">Evaluación</th>
              <th className="px-4 py-2 text-left text-gray-600">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="border-t">
                <td className="px-4 py-2">{grade.course}</td>
                <td className="px-4 py-2">{grade.evaluation}</td>
                <td className="px-4 py-2">{grade.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentGrades;

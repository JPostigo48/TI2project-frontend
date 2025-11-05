import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { calculateStats } from '../../utils/helpers';

/**
 * Página de gestión de notas para el docente.
 * Permite visualizar las notas de los estudiantes, editar puntajes y ver estadísticas.
 */
const GradeManagement = () => {
  const queryClient = useQueryClient();
  const {
    data: grades = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teacher-grades'],
    queryFn: () => TeacherService.getGrades(),
  });

  const [editValues, setEditValues] = useState({});

  const updateMutation = useMutation({
    mutationFn: ({ id, score }) => TeacherService.updateGrade(id, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-grades'] });
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando notas..." />;
  }
  if (error) {
    return <ErrorMessage message={error.message || 'Error al cargar las notas'} />;
  }

  const scores = grades.map((g) => g.score);
  const stats = calculateStats(scores);

  const handleInputChange = (id, value) => {
    setEditValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (id, currentScore) => {
    const newScore = editValues[id] ?? currentScore;
    updateMutation.mutate({ id, score: newScore });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Notas</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Promedio</p>
          <p className="text-3xl font-bold text-blue-700">{stats.avg}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Mayor</p>
          <p className="text-3xl font-bold text-green-700">{stats.max}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Menor</p>
          <p className="text-3xl font-bold text-purple-700">{stats.min}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Estudiante</th>
              <th className="px-4 py-2 text-left text-gray-600">Evaluación</th>
              <th className="px-4 py-2 text-left text-gray-600">Puntaje</th>
              <th className="px-4 py-2 text-left text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="border-t">
                <td className="px-4 py-2">{grade.student}</td>
                <td className="px-4 py-2">{grade.evaluation}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    defaultValue={grade.score}
                    onChange={(e) => handleInputChange(grade.id, e.target.value)}
                    className="border rounded px-2 py-1 w-20 text-center"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleSave(grade.id, grade.score)}
                    disabled={updateMutation.isLoading}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {updateMutation.isLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {updateMutation.isSuccess && (
        <p className="text-green-600 mt-2">¡Nota actualizada correctamente!</p>
      )}
      {updateMutation.isError && (
        <p className="text-red-600 mt-2">
          {updateMutation.error?.message || 'Error al actualizar nota'}
        </p>
      )}
    </div>
  );
};

export default GradeManagement;

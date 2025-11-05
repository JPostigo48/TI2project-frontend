import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

/**
 * Página para que el docente registre la asistencia de sus estudiantes.
 * Permite seleccionar quiénes asistieron y luego envía el listado al servicio.
 */
const Attendance = () => {
  const {
    data: students = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teacher-attendance-list'],
    queryFn: () => TeacherService.getAttendanceList(),
  });

  const [presentIds, setPresentIds] = useState(new Set());

  const togglePresent = (studentId) => {
    setPresentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const submitMutation = useMutation({
    mutationFn: () => TeacherService.submitAttendance({ present: Array.from(presentIds) }),
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando lista de asistencia..." />;
  }
  if (error) {
    return <ErrorMessage message={error.message || 'Error al cargar la lista de asistencia'} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tomar Asistencia</h1>
      <ul className="bg-white border rounded-lg divide-y">
        {students.map((student) => (
          <li key={student.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-600">{student.code}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={presentIds.has(student.id)}
                onChange={() => togglePresent(student.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              Presente
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={() => submitMutation.mutate()}
        disabled={submitMutation.isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        {submitMutation.isLoading ? 'Guardando...' : 'Guardar Asistencia'}
      </button>
      {submitMutation.isSuccess && (
        <p className="text-green-600 mt-2">¡Asistencia guardada correctamente!</p>
      )}
      {submitMutation.isError && (
        <p className="text-red-600 mt-2">
          {submitMutation.error?.message || 'Error al guardar asistencia'}
        </p>
      )}
    </div>
  );
};

export default Attendance;

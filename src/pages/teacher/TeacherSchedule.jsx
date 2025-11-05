import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

/**
 * Página que muestra el horario del docente.
 * Se lista cada clase con su día, hora, aula y sección.
 */
const TeacherSchedule = () => {
  const {
    data: schedule = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teacher-schedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando horario..." />;
  }
  if (error) {
    return <ErrorMessage message={error.message || 'Error al cargar el horario'} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Mi Horario</h1>
      {schedule.length === 0 ? (
        <p className="text-gray-600">No se encontraron clases en tu horario.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {schedule.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{item.courseName}</h3>
              <p className="text-sm text-gray-600 mb-1">Sección: {item.section} ({item.courseCode})</p>
              <p className="text-sm text-gray-600 mb-1">
                {item.day} {item.startTime} - {item.endTime}
              </p>
              <p className="text-sm text-gray-600">Aula: {item.room} | Alumnos: {item.studentCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSchedule;

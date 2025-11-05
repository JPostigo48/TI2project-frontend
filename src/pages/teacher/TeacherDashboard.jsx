import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { ROUTES } from '../../utils/constants';

/**
 * Dashboard principal para docentes.
 * Muestra un resumen de cursos, evaluaciones y enlaces rápidos a módulos clave.
 */
const TeacherDashboard = () => {
  const {
    data: schedule = [],
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useQuery({
    queryKey: ['teacher-schedule'],
    queryFn: () => TeacherService.getSchedule(),
  });
  const {
    data: grades = [],
    isLoading: gradesLoading,
    error: gradesError,
  } = useQuery({
    queryKey: ['teacher-grades'],
    queryFn: () => TeacherService.getGradesSummary(),
  });

  console.log(grades)

  if (scheduleLoading || gradesLoading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }
  if (scheduleError) {
    return <ErrorMessage message={scheduleError.message || 'Error al cargar horario'} />;
  }
  if (gradesError) {
    return <ErrorMessage message={gradesError.message || 'Error al cargar notas'} />;
  }

  const coursesCount = schedule.length;
  const evaluations = grades.map((g) => g.evaluation);
  const uniqueEvaluations = Array.from(new Set(evaluations));
  const evaluationsCount = uniqueEvaluations.length;
  const totalGrades = grades.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenido(a) al Panel Docente</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-600 mb-1">Cursos dictados</p>
          <p className="text-3xl font-bold text-blue-700">{coursesCount}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-600 mb-1">Evaluaciones</p>
          <p className="text-3xl font-bold text-green-700">{evaluationsCount}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
          <p className="text-sm text-purple-600 mb-1">Notas registradas</p>
          <p className="text-3xl font-bold text-purple-700">{totalGrades}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <Link
          to={ROUTES.TEACHER_ATTENDANCE}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center hover:bg-gray-50"
        >
          <span className="font-medium mb-1">Tomar Asistencia</span>
          <span className="text-sm text-gray-600">Registrar asistencia de tu clase</span>
        </Link>
        <Link
          to={ROUTES.TEACHER_GRADES}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center hover:bg-gray-50"
        >
          <span className="font-medium mb-1">Gestionar Notas</span>
          <span className="text-sm text-gray-600">Ingresar y revisar notas</span>
        </Link>
        <Link
          to={ROUTES.TEACHER_SCHEDULE}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center hover:bg-gray-50"
        >
          <span className="font-medium mb-1">Mi Horario</span>
          <span className="text-sm text-gray-600">Ver tus clases programadas</span>
        </Link>
        <Link
          to={ROUTES.TEACHER_ROOMS}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center hover:bg-gray-50"
        >
          <span className="font-medium mb-1">Reservar Ambiente</span>
          <span className="text-sm text-gray-600">Solicitar un ambiente</span>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;

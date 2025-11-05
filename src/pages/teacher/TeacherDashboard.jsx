// Panel principal para docentes.
// Este dashboard muestra un resumen de las actividades del docente:
// número de cursos/secciones dictados, sesiones de asistencia tomadas,
// evaluaciones distintas y total de notas registradas. Se actualizó para
// utilizar un nuevo método que agrupa las notas de todas las asignaciones
// del docente y para contabilizar las sesiones de asistencia.

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { ROUTES } from '../../utils/constants';

const TeacherDashboard = () => {
  // Cargar horario del docente
  const {
    data: schedule = [],
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useQuery({
    queryKey: ['teacher-schedule'],
    queryFn: () => TeacherService.getSchedule(),
  });
  // Cargar resumen de notas de todos los cursos
  const {
    data: allGrades = [],
    isLoading: gradesLoading,
    error: gradesError,
  } = useQuery({
    queryKey: ['teacher-all-grades'],
    queryFn: () => TeacherService.getAllGradesSummary(),
  });
  // Cargar sesiones de asistencia tomadas (de todos los cursos)
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ['teacher-attendance-sessions'],
    queryFn: () => TeacherService.listAttendanceSessions(),
  });

  if (scheduleLoading || gradesLoading || sessionsLoading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }
  if (scheduleError) {
    return <ErrorMessage message={scheduleError.message || 'Error al cargar horario'} />;
  }
  if (gradesError) {
    return <ErrorMessage message={gradesError.message || 'Error al cargar notas'} />;
  }
  if (sessionsError) {
    return <ErrorMessage message={sessionsError.message || 'Error al cargar sesiones'} />;
  }

  // Calcular número de cursos/secciones únicos
  const uniqueAssignments = new Set();
  schedule.forEach((b) => {
    uniqueAssignments.add(`${b.courseCode}-${b.section}`);
  });
  const coursesCount = uniqueAssignments.size;

  // Calcular evaluaciones distintas (parciales) a partir de las notas
  const evaluationSet = new Set();
  allGrades.forEach((g) => {
    Object.keys(g.partials).forEach((key) => {
      evaluationSet.add(key);
    });
  });
  const evaluationsCount = evaluationSet.size;

  // Calcular total de notas registradas (cada parcial tiene continua y examen; substitutivo cuenta si existe)
  let totalGrades = 0;
  allGrades.forEach((g) => {
    Object.values(g.partials).forEach((p) => {
      if (p.continuous != null) totalGrades += 1;
      if (p.exam != null) totalGrades += 1;
    });
    if (g.substitutive != null) totalGrades += 1;
  });

  // Cantidad de sesiones de asistencia tomadas
  const sessionsCount = sessions.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenido(a) al Panel Docente</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-600 mb-1">Cursos dictados</p>
          <p className="text-3xl font-bold text-blue-700">{coursesCount}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-600 mb-1">Sesiones de asistencia</p>
          <p className="text-3xl font-bold text-green-700">{sessionsCount}</p>
        </div>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
          <p className="text-sm text-orange-600 mb-1">Evaluaciones</p>
          <p className="text-3xl font-bold text-orange-700">{evaluationsCount}</p>
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
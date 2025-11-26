import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  BarChart2, 
  Calendar, 
  CheckSquare, 
  FileText,
  Layers 
} from 'lucide-react'; 

import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { ROUTES } from '../../utils/constants';

const TeacherDashboard = () => {
  // 1. Cargar horario
  const {
    data: schedule = [],
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useQuery({
    queryKey: ['teacher-schedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  // 2. Cargar resumen de notas
  const {
    data: allGrades = [],
    isLoading: gradesLoading,
    error: gradesError,
  } = useQuery({
    queryKey: ['teacher-all-grades'],
    queryFn: () => TeacherService.getAllGradesSummary(),
  });

  // 3. Cargar sesiones de asistencia
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ['teacher-attendance-sessions'],
    queryFn: () => TeacherService.listAttendanceSessions(),
  });

  // --- CÁLCULOS ---
  
  const stats = useMemo(() => {
    // A. GRUPOS / SECCIONES ÚNICAS
    const uniqueGroups = new Set();
    console.log(schedule)
    if (Array.isArray(schedule)) {
        schedule.forEach((b) => {
            
            const code = b.course?.code || b.courseCode || 'UNKNOWN';
            const group = b.group || b.section || 'UD'; 
            
            uniqueGroups.add(`${code}-${group}`);
        });
    }

    // B. Evaluaciones y Notas Totales
    const evaluationTypes = new Set();
    let totalGradesCount = 0;

    if (Array.isArray(allGrades)) {
        allGrades.forEach((g) => {
            const partials = g.partials || {};
            
            Object.keys(partials).forEach((key) => evaluationTypes.add(key));

            Object.values(partials).forEach((p) => {
                if (p?.continuous !== null && p?.continuous !== undefined) totalGradesCount++;
                if (p?.exam !== null && p?.exam !== undefined) totalGradesCount++;
            });
            
            if (g.substitutive !== null && g.substitutive !== undefined) totalGradesCount++;
        });
    }

    // C. Sesiones
    const sessionsCount = Array.isArray(sessions) ? sessions.length : 0;

    return {
        groupsCount: uniqueGroups.size, 
        sessions: sessionsCount,
        evalTypes: evaluationTypes.size,
        totalGrades: totalGradesCount
    };
  }, [schedule, allGrades, sessions]);


  if (scheduleLoading || gradesLoading || sessionsLoading) {
    return <LoadingSpinner message="Cargando panel docente..." />;
  }
  
  if (scheduleError) return <ErrorMessage message="Error cargando información vital." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Panel Docente</h1>
        <p className="text-blue-100 opacity-90">
          Gestión académica y control de evaluaciones del semestre 2025-B
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* CARD MODIFICADA: GRUPOS */}
        <div className="card p-5 border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase">Grupos</p>
            <p className="text-3xl font-bold text-gray-800">{stats.groupsCount}</p>
          </div>
          {/* Cambié el icono a Layers que representa mejor "grupos" o "stacks" */}
          <Layers className="text-blue-200" size={32} />
        </div>

        <div className="card p-5 border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase">Asistencias</p>
            <p className="text-3xl font-bold text-gray-800">{stats.sessions}</p>
          </div>
          <Users className="text-green-200" size={32} />
        </div>

        <div className="card p-5 border-l-4 border-orange-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase">Evaluaciones</p>
            <p className="text-3xl font-bold text-gray-800">{stats.evalTypes}</p>
          </div>
          <ClipboardCheck className="text-orange-200" size={32} />
        </div>

        <div className="card p-5 border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase">Notas Reg.</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalGrades}</p>
          </div>
          <BarChart2 className="text-purple-200" size={32} />
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gestión Rápida</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            to={ROUTES.TEACHER_ATTENDANCE}
            className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-center"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <CheckSquare size={24} />
            </div>
            <span className="block font-semibold text-gray-800 mb-1">Tomar Asistencia</span>
            <span className="text-xs text-gray-500">Registrar presentes y faltas</span>
          </Link>

          <Link
            to={ROUTES.TEACHER_GRADES}
            className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all text-center"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FileText size={24} />
            </div>
            <span className="block font-semibold text-gray-800 mb-1">Gestionar Notas</span>
            <span className="text-xs text-gray-500">Subir notas y actas</span>
          </Link>

          <Link
            to={ROUTES.TEACHER_SCHEDULE}
            className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all text-center"
          >
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
            </div>
            <span className="block font-semibold text-gray-800 mb-1">Mi Horario</span>
            <span className="text-xs text-gray-500">Ver carga académica</span>
          </Link>

          <Link
            to={ROUTES.TEACHER_ROOMS} 
            className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all text-center"
          >
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users size={24} />
            </div>
            <span className="block font-semibold text-gray-800 mb-1">Reservar Aula</span>
            <span className="text-xs text-gray-500">Solicitar ambiente extra</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
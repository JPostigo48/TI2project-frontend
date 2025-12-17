import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Calendar, FileText, GraduationCap, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';
import NextClassCard from '../../components/shared/NextClassCard';

const StudentDashboard = () => {
  const { user } = useAuth();

  // 1. Query para el Resumen (Notas/Promedio)
  const { 
    data: dashboardData, 
    isLoading: loadingStats, 
    error: errorStats 
  } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => StudentService.getDashboardSummary(),
    staleTime: 1000 * 60 * 5, 
  });

  // 2. Query para el Horario (Necesario para la NextClassCard)
  const { 
    data: schedule = [], 
    isLoading: loadingSchedule 
  } = useQuery({
    queryKey: ['studentSchedule'],
    queryFn: () => StudentService.getSchedule(),
  });

  // 3. Transformar el horario a lista plana
  const flatSchedule = useMemo(() => {
    if (!Array.isArray(schedule)) return [];
    
    return schedule.map(block => ({
        day: block.day,
        startHour: Number(block.startHour),
        duration: Number(block.duration || 1),
        room: block.room,
        courseName: block.courseName || 'Curso',
        code: block.courseCode,
        group: block.group,
        type: block.type || 'theory'
    }));
  }, [schedule]);

  const quickLinks = [
    {
      title: 'Mi Horario',
      description: 'Ver mi horario de clases',
      icon: Calendar,
      color: 'blue',
      path: ROUTES.STUDENT_SCHEDULE,
    },
    {
      title: 'Mis Notas',
      description: 'Ver notas y desempeño',
      icon: FileText,
      color: 'green',
      path: ROUTES.STUDENT_GRADES,
    },
    {
      title: 'Laboratorios',
      description: 'Inscripción a laboratorios',
      icon: GraduationCap,
      color: 'purple',
      path: ROUTES.STUDENT_LABS,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    };
    return colors[color] || colors.blue;
  };

  if (loadingStats || loadingSchedule) return <LoadingSpinner message="Cargando tu panel..." />;
  if (errorStats) return <ErrorMessage message="No pudimos cargar el resumen." />;

  // Datos seguros
  const { stats } = dashboardData || { stats: { average: 0, coursesCount: 0 } };
  
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER CON GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* BIENVENIDA */}
        <div className="lg:col-span-2 bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-blue-100 opacity-90 max-w-md">
            Bienvenido al panel estudiantil. Tienes <span className="font-bold text-white">{stats.coursesCount || 0} cursos</span> activos este semestre.
          </p>
          <div className="mt-6 inline-flex bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
             <span className="text-sm font-medium">Código: {user?.code}</span>
          </div>
        </div>

        {/* TARJETA PRÓXIMA CLASE */}
        <div className="lg:col-span-1 h-full">
           <NextClassCard schedule={flatSchedule} />
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`card p-6 rounded-xl border border-transparent ${getColorClasses(link.color)} transition-all hover:shadow-md hover:scale-[1.02] duration-200 block`}
              >
                <Icon size={32} className="mb-3" />
                <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
                <p className="text-sm opacity-80">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RESUMEN DE DESEMPEÑO */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mi Desempeño</h2>
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Tarjeta de Promedio */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Promedio Ponderado</h3>
            </div>
            
            <div className="space-y-4">
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">{stats.average || "0.0"}</span>
                  <span className="text-sm text-gray-500">/ 20.0</span>
               </div>
               
               <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(parseFloat(stats.average || 0) / 20) * 100}%` }}
                  ></div>
               </div>
               <p className="text-xs text-gray-400">Calculado en base a notas registradas</p>
            </div>
          </div>

          {/* Tarjeta Resumen Cursos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Carga Académica</p>
                   <h3 className="text-2xl font-bold text-gray-800">{stats.coursesCount} Cursos</h3>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                   <FileText size={20} />
                </div>
             </div>
             <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                   <span className="block text-2xl font-bold text-gray-800">2025-B</span>
                   <span className="text-xs text-gray-500">Semestre</span>
                </div>
                <div>
                   <span className="block text-2xl font-bold text-green-600">Activo</span>
                   <span className="text-xs text-gray-500">Estado</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
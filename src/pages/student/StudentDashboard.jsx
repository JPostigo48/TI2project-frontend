import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
// 1. Importamos el servicio y tus componentes compartidos
import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { Calendar, FileText, GraduationCap, TrendingUp, Clock, MapPin } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const StudentDashboard = () => {
  const { user } = useAuth();

  // 2. Usamos useQuery llamando al SERVICIO, no a axios directo
  const { 
    data: dashboardData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => StudentService.getDashboardSummary(), // <--- Llamada a través del servicio
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

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

  // 3. Usamos tus componentes de carga y error para mantener consistencia visual
  if (isLoading) return <LoadingSpinner message="Cargando tu panel..." />;
  if (error) {
    console.log(error)
    return <ErrorMessage message="No pudimos cargar el resumen. Intenta recargar." />;
  }

  // Valores por defecto seguros para evitar crashes si el backend devuelve null
  const { stats, nextClass } = dashboardData || { stats: { average: 0, coursesCount: 0 }, nextClass: null };

  return (
    <div className="space-y-6 animate-fade-in"> {/* Agregué animate-fade-in como en tu otro componente */}
      
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-blue-100 opacity-90">
          Código: {user?.code} | Ciencia de la Computación
        </p>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Accesos Rápidos</h2>
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

      {/* RESUMEN DINÁMICO */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen</h2>
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* TARJETA 1: PRÓXIMAS CLASES */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Próxima Clase</h3>
            </div>
            
            <div className="space-y-3">
              {nextClass ? (
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-bold text-gray-800 text-lg">{nextClass.courseName}</p>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-600 gap-4">
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{nextClass.day} {nextClass.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs font-bold px-2 py-1 bg-white text-blue-700 rounded shadow-sm">
                      {nextClass.type}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 bg-white text-gray-700 rounded shadow-sm flex items-center gap-1">
                       <MapPin size={12}/> Aula {nextClass.room}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No tienes clases próximas.</p>
                </div>
              )}
            </div>
          </div>

          {/* TARJETA 2: MI DESEMPEÑO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Mi Desempeño</h3>
            </div>
            
            <div className="space-y-6">
              {/* Promedio General */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Promedio Ponderado</span>
                  <span className="font-bold text-2xl text-green-600">{stats.average || "0.0"}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(parseFloat(stats.average || 0) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Cursos Matriculados */}
              <div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Cursos Matriculados</span>
                        <span className="text-xl font-bold text-gray-800">{stats.coursesCount || 0}</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <FileText size={16} />
                    </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, FileText, GraduationCap, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const StudentDashboard = () => {
  const { user } = useAuth();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-blue-100">
          Código: {user?.code} | Ciencia de la Computación
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Accesos Rápidos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`card ${getColorClasses(link.color)} transition-all hover:shadow-md`}
              >
                <Icon size={32} className="mb-3" />
                <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
                <p className="text-sm opacity-80">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Resumen rápido */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Próximas clases */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold">Próximas Clases</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Trabajo Interdisciplinar II</p>
                  <p className="text-sm text-gray-600">Lunes 08:00 - 10:00</p>
                </div>
                <span className="text-xs font-medium text-blue-600">Lab 301</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Base de Datos II</p>
                  <p className="text-sm text-gray-600">Martes 10:00 - 12:00</p>
                </div>
                <span className="text-xs font-medium text-blue-600">Aula 205</span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold">Mi Desempeño</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Promedio General</span>
                  <span className="font-semibold text-green-600">16.4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Asistencia</span>
                  <span className="font-semibold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">3</span> cursos en progreso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
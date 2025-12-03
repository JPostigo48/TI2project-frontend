import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Users, CalendarDays, Building2, BarChart3 } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

import AdminService from '../../services/admin.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const AdminDashboard = () => {
  const { user } = useAuth();

  const {
    data: statsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => AdminService.getDashboard(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingSpinner message="Cargando panel de administrador..." />;
  if (error) return <ErrorMessage message="No pudimos cargar las estadísticas del sistema." />;

  const stats = statsData || { students: 0, teachers: 0, courses: 0 };

  const quickLinks = [
    {
      title: 'Gestión de usuarios',
      description: 'Crear, editar y desactivar cuentas',
      icon: Users,
      color: 'blue',
      path: ROUTES.ADMIN_USERS,
    },
    {
      title: 'Semestres',
      description: 'Configurar periodos académicos',
      icon: CalendarDays,
      color: 'green',
      path: ROUTES.ADMIN_SEMESTERS,
    },
    {
      title: 'Aulas y ambientes',
      description: 'Gestionar aulas disponibles',
      icon: Building2,
      color: 'purple',
      path: ROUTES.ADMIN_ROOMS,
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
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bienvenida / Resumen principal */}
        <div className="lg:col-span-2 bg-linear-to-r from-slate-900 to-indigo-700 rounded-xl p-8 text-white shadow-lg flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">
            Panel administrativo{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-indigo-100 opacity-90 max-w-md">
            Desde aquí puedes gestionar usuarios, semestres y aulas de la Escuela de Ciencia
            de la Computación.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <div className="inline-flex bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 text-sm">
              <span className="font-medium">Alumnos activos:&nbsp;</span>
              <span className="font-bold">{stats.students ?? 0}</span>
            </div>
            <div className="inline-flex bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 text-sm">
              <span className="font-medium">Docentes activos:&nbsp;</span>
              <span className="font-bold">{stats.teachers ?? 0}</span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 disabled:opacity-60"
            >
              <BarChart3 size={16} />
              {isFetching ? 'Actualizando...' : 'Actualizar datos'}
            </button>
          </div>
        </div>

        {/* Tarjeta resumen pequeña */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Resumen del sistema
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.courses ?? 0} cursos
                </h3>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <BarChart3 size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div>
                <span className="block text-gray-500">Alumnos activos</span>
                <span className="text-xl font-semibold text-gray-900">
                  {stats.students ?? 0}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Docentes activos</span>
                <span className="text-xl font-semibold text-gray-900">
                  {stats.teachers ?? 0}
                </span>
              </div>
            </div>
          </div>
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
                className={`card p-6 rounded-xl border border-transparent ${getColorClasses(
                  link.color
                )} transition-all hover:shadow-md hover:scale-[1.02] duration-200 block`}
              >
                <Icon size={32} className="mb-3" />
                <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
                <p className="text-sm opacity-80">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RESUMEN SIMPLE (si quieres dejarlo separado) */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Sistema</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
              Alumnos activos
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.students ?? 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
              Docentes activos
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.teachers ?? 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
              Cursos cargados
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.courses ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../utils/constants';
import {
  Home,
  Calendar,
  GraduationCap,
  ClipboardList,
  FileText,
  DoorOpen,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Definir menú según rol
  const getMenuItems = () => {
    if (user?.role === ROLES.STUDENT) {
      return [
        { path: ROUTES.STUDENT_DASHBOARD, label: 'Inicio', icon: Home },
        { path: ROUTES.STUDENT_SCHEDULE, label: 'Mi Horario', icon: Calendar },
        { path: ROUTES.STUDENT_GRADES, label: 'Mis Notas', icon: FileText },
        { path: ROUTES.STUDENT_LABS, label: 'Laboratorios', icon: GraduationCap },
      ];
    }
    if (user?.role === ROLES.TEACHER) {
      return [
        { path: ROUTES.TEACHER_DASHBOARD, label: 'Inicio', icon: Home },
        { path: ROUTES.TEACHER_ATTENDANCE, label: 'Asistencia', icon: ClipboardList },
        { path: ROUTES.TEACHER_GRADES, label: 'Notas', icon: FileText },
        { path: ROUTES.TEACHER_SCHEDULE, label: 'Horario', icon: Calendar },
        { path: ROUTES.TEACHER_ROOMS, label: 'Ambientes', icon: DoorOpen },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-22">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SA</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
                Sistema Académico
              </span>
            </div>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario y logout (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <User size={18} className="text-gray-600" />
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.code}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>

          {/* Botón menú móvil */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {/* Info de usuario */}
            <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg mb-3">
              <User size={20} className="text-gray-600" />
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.code}</p>
              </div>
            </div>

            {/* Menú items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

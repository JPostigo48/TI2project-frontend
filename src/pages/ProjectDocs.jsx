import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Folder, File, Code, Database, Settings, LogIn, Users, BookOpen, CheckCircle2 } from 'lucide-react';

const ProjectDocs = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({
    'src': true,
    'api': true,
    'services': true,
    'components': true,
    'pages': true,
  });

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const structure = {
    'src/': {
      type: 'folder',
      key: 'src',
      children: {
        'api/': { type: 'folder', key: 'api', icon: <Database className="w-4 h-4 text-blue-500" /> },
        'services/': { type: 'folder', key: 'services', icon: <Code className="w-4 h-4 text-green-500" /> },
        'mocks/': { type: 'folder', icon: <Database className="w-4 h-4 text-yellow-500" /> },
        'hooks/': { type: 'folder' },
        'context/': { type: 'folder' },
        'components/': {
          type: 'folder',
          key: 'components',
          children: {
            'shared/': { type: 'folder' },
            'student/': { type: 'folder' },
            'teacher/': { type: 'folder' },
          }
        },
        'pages/': {
          type: 'folder',
          key: 'pages',
          children: {
            'student/': { type: 'folder' },
            'teacher/': { type: 'folder' },
          }
        },
        'routes/': { type: 'folder', icon: <Settings className="w-4 h-4 text-purple-500" /> },
        'utils/': { type: 'folder' },
        'config/': { type: 'folder', icon: <Settings className="w-4 h-4 text-red-500" /> },
      }
    },
  };

  const renderTree = (node, name, level = 0) => {
    if (node.type === 'file') {
      return (
        <div key={name} className="flex items-center gap-2 py-1 px-2" style={{ paddingLeft: `${level * 20 + 8}px` }}>
          <File className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono">{name}</span>
        </div>
      );
    }

    const isExpanded = expanded[node.key];
    
    return (
      <div key={name}>
        <div 
          className="flex items-center gap-2 py-1 px-2 hover:bg-blue-50 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => node.key && toggle(node.key)}
        >
          {node.key ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : <div className="w-4" />}
          {node.icon || <Folder className="w-4 h-4 text-blue-500" />}
          <span className="text-sm font-mono font-semibold">{name}</span>
        </div>
        {(!node.key || isExpanded) && node.children && (
          <div>
            {Object.entries(node.children).map(([childName, childNode]) => 
              renderTree(childNode, childName, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">🎓 Sistema Académico UNSA</h1>
              <p className="text-blue-100 text-lg">
                Plataforma web para gestión académica de estudiantes y docentes
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Trabajo Interdisciplinar II</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>2024-1</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <LogIn size={20} />
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Equipo */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Equipo de Desarrollo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Natalie Marleny Lazo Paxi',
              'Juan Carlos Postigo Cabana',
              'Leonardo Adriano Paxi Huayhua',
              'Jhosep Angel Cacsire Sanchez',
              'Jorge Patrick Taquiri Guerreros',
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">
                  {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="text-sm text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Módulo Estudiante</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Ver horario semanal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Consultar notas y evaluaciones</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Matrícula de laboratorios</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Módulo Docente</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Tomar asistencia</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Ingresar notas con estadísticas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Reserva de ambientes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Stack Tecnológico</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>React 18 + Vite</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>React Query + Axios</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                <span>Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Arquitectura */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📁 Arquitectura del Proyecto</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Estructura de carpetas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Estructura de Carpetas</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-sm overflow-auto max-h-[400px]">
                {Object.entries(structure).map(([name, node]) => renderTree(node, name))}
              </div>
            </div>

            {/* Capas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Capas de la Arquitectura</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-1">📱 Presentación</h4>
                  <p className="text-sm text-gray-600">
                    Pages y Components - Interfaz de usuario con React
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-1">⚙️ Aplicación</h4>
                  <p className="text-sm text-gray-600">
                    Services y Hooks - Lógica de negocio y casos de uso
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-1">🔌 Infraestructura</h4>
                  <p className="text-sm text-gray-600">
                    API Client y Mocks - Comunicación con backend
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-1">💾 Estado</h4>
                  <p className="text-sm text-gray-600">
                    Context y React Query - Gestión de estado global
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Universidad Nacional de San Agustín de Arequipa
          </p>
          <p className="text-sm mt-1">
            Escuela Profesional de Ciencia de la Computación
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Docente: Yessenia Deysi Yari Ramos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocs;
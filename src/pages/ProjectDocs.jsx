import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Code,
  Database,
  Settings,
  LogIn,
  Users,
  BookOpen,
  CheckCircle2,
  Circle,
  Cloud,
  ShieldCheck,
  Layers,
  Server,
  Layout
} from 'lucide-react';

const ProjectDocs = () => {
  const navigate = useNavigate();
  
  // Estado para colapsar/expandir carpetas
  const [expanded, setExpanded] = useState({
    src: true,
    'src/api': true,
    'src/components': true,
    'src/pages': true,
    'src/services': true,
    'src/controllers': true,
    'src/models': true,
    'src/routes': true,
  });

  // Estado para alternar vista de estructura (Front/Back)
  const [activeTab, setActiveTab] = useState('frontend');

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- ESTRUCTURA DEL FRONTEND (Basada en tu Repo) ---
  const frontendStructure = {
    'src/': {
      type: 'folder',
      key: 'src',
      children: {
        'api/': { 
            type: 'folder', key: 'src/api', icon: <Cloud className="w-4 h-4 text-blue-500" />,
            children: { 'axiosClient.js': { type: 'file' }, 'endpoints.js': { type: 'file' } } 
        },
        'components/': {
          type: 'folder', key: 'src/components',
          children: {
            'shared/': { type: 'folder', children: { 'NextClassCard.jsx': {type:'file'}, 'ScheduleTable.jsx': {type:'file'}, 'LoadingSpinner.jsx': {type:'file'} } },
            'student/': { type: 'folder' },
            'teacher/': { type: 'folder' },
          },
        },
        'context/': { type: 'folder', children: { 'AuthContext.jsx': { type: 'file' } } },
        'hooks/': { type: 'folder', children: { 'useAuth.js': { type: 'file' } } },
        'mocks/': { type: 'folder', icon: <Database className="w-4 h-4 text-yellow-500" /> },
        'pages/': {
          type: 'folder', key: 'src/pages',
          children: {
            'student/': { type: 'folder', children: { 'StudentDashboard.jsx': {type:'file'}, 'StudentLabs.jsx': {type:'file'} } },
            'teacher/': { type: 'folder', children: { 'TeacherDashboard.jsx': {type:'file'}, 'GradeManagement.jsx': {type:'file'}, 'RoomReservation.jsx': {type:'file'} } },
          },
        },
        'services/': { 
            type: 'folder', key: 'src/services', icon: <Code className="w-4 h-4 text-green-500" />,
            children: { 'auth.service.js': {type:'file'}, 'student.service.js': {type:'file'}, 'teacher.service.js': {type:'file'} }
        },
        'utils/': { type: 'folder', children: { 'constants.js': {type:'file'}, 'scheduleHelpers.js': {type:'file'} } },
        'App.jsx': { type: 'file' },
        'main.jsx': { type: 'file' },
      },
    },
  };

  // --- ESTRUCTURA DEL BACKEND (Basada en tu Repo) ---
  const backendStructure = {
    'src/': {
      type: 'folder',
      key: 'src',
      children: {
        'config/': { type: 'folder', children: { 'db.js': { type: 'file' } } },
        'controllers/': { 
            type: 'folder', key: 'src/controllers', icon: <Settings className="w-4 h-4 text-purple-500" />,
            children: { 
                'auth.controller.js': {type:'file'}, 
                'course.controller.js': {type:'file'}, 
                'grade.controller.js': {type:'file'}, 
                'room.controller.js': {type:'file'},
                'teacher.controller.js': {type:'file'}
            } 
        },
        'middlewares/': { type: 'folder', children: { 'validateToken.js': { type: 'file' } } },
        'models/': { 
            type: 'folder', key: 'src/models', icon: <Database className="w-4 h-4 text-green-600" />,
            children: { 
                'User.js': {type:'file'}, 
                'Course.js': {type:'file'}, 
                'Section.js': {type:'file'}, 
                'Grade.js': {type:'file'},
                'RoomReservation.js': {type:'file'} 
            } 
        },
        'routes/': { 
            type: 'folder', key: 'src/routes', icon: <Layers className="w-4 h-4 text-orange-500" />,
            children: { 'auth.routes.js': {type:'file'}, 'student.routes.js': {type:'file'}, 'teacher.routes.js': {type:'file'} } 
        },
        'app.js': { type: 'file' },
        'index.js': { type: 'file' },
      },
    },
    'scripts/': { type: 'folder', children: { 'seed-demo.js': { type: 'file' } } },
    'vercel.json': { type: 'file' },
    '.env': { type: 'file' },
  };

  const renderTree = (node, name, level = 0) => {
    if (node.type === 'file') {
      return (
        <div key={name} className="flex items-center gap-2 py-1 px-2" style={{ paddingLeft: `${level * 20 + 8}px` }}>
          <File className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono text-gray-600">{name}</span>
        </div>
      );
    }
    const isExpanded = expanded[node.key];
    return (
      <div key={name}>
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => node.key && toggle(node.key)}
        >
          {node.key ? (isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />) : <div className="w-4" />}
          {node.icon || <Folder className="w-4 h-4 text-blue-500" />}
          <span className="text-sm font-mono font-semibold text-gray-700">{name}</span>
        </div>
        {(!node.key || isExpanded) && node.children && (
          <div>
            {Object.entries(node.children).map(([childName, childNode]) => renderTree(childNode, childName, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // --- DATOS DEL EQUIPO Y ROADMAP ---
  const teamMembers = [
    { name: 'Juan Carlos Postigo Cabana', status: 'active' },
    { name: 'Leonardo Adriano Paxi Huayhua', status: 'active' },
    { name: 'Jorge Patrick Taquiri Guerreros', status: 'active' },
    { name: 'Natalie Marleny Lazo Paxi', status: 'inactive' },
    { name: 'Jhosep Angel Cacsire Sanchez', status: 'inactive' },
  ];

  const roadmapTimeline = [
    {
      date: '5 de noviembre de 2025',
      members: [
        {
          name: 'Juan Carlos Postigo Cabana',
          status: 'active',
          done: ['Diseño de arquitectura inicial', 'Configuración de CI/CD y rutas base', 'Implementación de Core Components'],
          todo: ['Refactorización de estilos', 'Integración de persistencia'],
        },
        {
          name: 'Leonardo Adriano Paxi Huayhua',
          status: 'active',
          done: ['Maquetación de horario docente', 'Prototipo de reservas'],
          todo: ['Optimización de consultas'],
        },
        {
          name: 'Jorge Patrick Taquiri Guerreros',
          status: 'active',
          done: ['Endpoints básicos de matrícula', 'Consultas de calendario'],
          todo: ['Validación de cruces de horario'],
        },
      ],
    },
    {
        date: '22 de noviembre de 2025',
        members: [
          {
            name: 'Juan Carlos Postigo Cabana',
            status: 'active',
            done: [
              'Reingeniería del Backend (Migración a Arquitectura en Capas)',
              'Implementación de seguridad JWT y Middlewares',
              'Conexión Cliente-Servidor y manejo de CORS',
            ],
            todo: [],
          },
          {
            name: 'Leonardo Adriano Paxi Huayhua',
            status: 'active',
            done: ['Integración de visualización de datos en frontend'],
            todo: [],
          },
          {
            name: 'Jorge Patrick Taquiri Guerreros',
            status: 'active',
            done: ['Pruebas de endpoints y corrección de bugs menores'],
            todo: [],
          },
        ],
      },
    {
      date: '26 de noviembre de 2025 (Sprint Actual)',
      members: [
        {
          name: 'Juan Carlos Postigo Cabana',
          status: 'active',
          done: [
            'Despliegue de Infraestructura Cloud (Vercel + Atlas)',
            'Implementación de lógica "Context-Aware" para asistencia',
            'Resolución de condiciones de carrera en notas (Atomicidad BD)',
            'Refactorización completa de servicios y optimización de rendimiento',
          ],
          todo: ['Monitoreo de producción'],
        },
        {
          name: 'Leonardo Adriano Paxi Huayhua',
          status: 'active',
          done: ['Implementación visual de tarjetas de clase dinámica', 'Ajustes de UX en módulo de horarios'],
          todo: [],
        },
        {
          name: 'Jorge Patrick Taquiri Guerreros',
          status: 'active',
          done: ['Soporte en esquemas de base de datos para reservas', 'Validación de respuestas JSON'],
          todo: [],
        },
      ],
    },
  ];

  const futureTasks = [
    'Implementación de algoritmo de asignación masiva (Batch Processing)',
    'Reportes administrativos en PDF',
    'Módulo de analítica avanzada',
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                    Release Candidate 1.0
                 </span>
                 <span className="flex items-center gap-1 text-green-300 text-xs font-bold uppercase tracking-wider">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/> Online
                 </span>
              </div>
              <h1 className="text-4xl font-bold mb-3 tracking-tight">Sistema Académico UNSA</h1>
              <p className="text-blue-100 text-lg max-w-2xl font-light">
                Plataforma integral de gestión curricular, matrícula y seguimiento académico.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Users size={16} />
                  <span>Trabajo Interdisciplinar II</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <BookOpen size={16} />
                  <span>Semestre 2025-B</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <LogIn size={20} className="group-hover:text-blue-800"/>
              Acceder al Sistema
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* SECCIÓN 0: Equipo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
             <Users className="text-blue-600" /> Equipo de Desarrollo
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, i) => {
              const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
              const isInactive = member.status === 'inactive';

              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isInactive
                      ? 'bg-red-50/50 border-red-100 text-red-800 opacity-80'
                      : 'bg-white border-gray-200 text-gray-800 shadow-sm hover:shadow-md hover:border-blue-200'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${
                      isInactive ? 'bg-red-100 text-red-600' : 'bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700'
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{member.name}</span>
                    {isInactive ? (
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wide mt-0.5">Inactivo</span>
                    ) : (
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wide mt-0.5 flex items-center gap-1">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Activo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        {/* SECCIÓN 1: ARQUITECTURA DEL SISTEMA */}
        <div className="grid lg:grid-cols-2 gap-10">
            
            {/* Columna Izquierda: Estructura de Archivos */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Folder className="text-blue-600" size={20} /> Estructura del Proyecto
                    </h3>
                    <div className="flex bg-gray-200 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('frontend')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'frontend' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Frontend
                        </button>
                        <button 
                            onClick={() => setActiveTab('backend')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'backend' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Backend
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[500px]">
                    {Object.entries(activeTab === 'frontend' ? frontendStructure : backendStructure).map(([name, node]) => renderTree(node, name))}
                </div>
            </div>

            {/* Columna Derecha: Capas de Arquitectura */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Layers className="text-purple-600" /> Arquitectura de Software
                    </h2>
                    <p className="text-gray-600 mb-6">
                        El sistema implementa una arquitectura <strong>Cliente-Servidor desacoplada</strong> basada en el stack MERN, diseñada para escalabilidad y mantenimiento modular.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Capa 1: Presentación */}
                    <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-xl group-hover:bg-blue-600 transition-colors"/>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Layout size={24}/></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">Capa de Presentación (Frontend)</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    SPA reactiva construida con <strong>React 18 + Vite</strong>. Utiliza <strong>React Query</strong> para la gestión asíncrona del estado del servidor y caché, eliminando la necesidad de Redux para datos remotos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Capa 2: API & Negocio */}
                    <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-300">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500 rounded-l-xl group-hover:bg-purple-600 transition-colors"/>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Server size={24}/></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">Capa de Aplicación (Backend API)</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    RESTful API en <strong>Node.js/Express</strong>. Implementa el patrón <em>Controller-Service</em> para separar la lógica de negocio (cálculos de promedios, validación de cruces) del manejo de peticiones HTTP.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Capa 3: Persistencia */}
                    <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-green-300">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-xl group-hover:bg-green-600 transition-colors"/>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Database size={24}/></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">Capa de Persistencia (Data)</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Base de datos documental en <strong>MongoDB Atlas</strong>. Modelado de datos estricto con <strong>Mongoose</strong>, utilizando referencias para relaciones (User-Section-Grade) y operaciones atómicas para integridad transaccional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Capa 4: Seguridad */}
                    <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-orange-300">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-xl group-hover:bg-orange-600 transition-colors"/>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><ShieldCheck size={24}/></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">Seguridad & Infraestructura</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Autenticación <strong>Stateless JWT</strong>. Despliegue Serverless en Vercel con variables de entorno encriptadas y política CORS estricta para proteger los recursos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* SECCIÓN 2: ROADMAP */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
             <Settings className="text-purple-600" /> Roadmap & Progreso del Proyecto
          </h2>

          <div className="space-y-12 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {roadmapTimeline.map((block, idx) => (
              <div key={idx} className="relative pl-12">
                <div className="absolute left-[11px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-md" />
                <h3 className="text-xl font-bold text-gray-800 mb-6">{block.date}</h3>
                <div className="grid gap-6 lg:grid-cols-1">
                  {block.members.map((member, i) => {
                    if (member.status === 'inactive') return null;
                    return (
                      <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                           {member.name}
                        </h4>
                        <div className="space-y-3">
                          {member.done.length > 0 && (
                            <div>
                                <h5 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1 uppercase tracking-wide">
                                <CheckCircle2 size={14} /> Implementado
                                </h5>
                                <ul className="space-y-2">
                                    {member.done.map((task, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-100 shadow-sm">
                                        <CheckCircle2 size={16} className="mt-0.5 text-green-500 shrink-0" />
                                        <span>{task}</span>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
          <p className="font-bold text-gray-700">Universidad Nacional de San Agustín de Arequipa</p>
          <p>Escuela Profesional de Ciencia de la Computación</p>
          <p className="mt-2">Curso: Trabajo Interdisciplinar II • Docente: Yessenia Deysi Yari Ramos</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocs;
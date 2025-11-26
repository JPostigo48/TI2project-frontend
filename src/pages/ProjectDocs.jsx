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
} from 'lucide-react';

const ProjectDocs = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({
    src: true,
    api: true,
    services: true,
    components: true,
    pages: true,
  });

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
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
          },
        },
        'pages/': {
          type: 'folder',
          key: 'pages',
          children: {
            'student/': { type: 'folder' },
            'teacher/': { type: 'folder' },
          },
        },
        'routes/': { type: 'folder', icon: <Settings className="w-4 h-4 text-purple-500" /> },
        'utils/': { type: 'folder' },
        'config/': { type: 'folder', icon: <Settings className="w-4 h-4 text-red-500" /> },
      },
    },
  };

  const renderTree = (node, name, level = 0) => {
    if (node.type === 'file') {
      return (
        <div
          key={name}
          className="flex items-center gap-2 py-1 px-2"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
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
          ) : (
            <div className="w-4" />
          )}
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

  // Equipo (incluye retirados)
  const teamMembers = [
    {
      name: 'Juan Carlos Postigo Cabana',
      status: 'active',
    },
    {
      name: 'Leonardo Adriano Paxi Huayhua',
      status: 'active',
    },
    {
      name: 'Jorge Patrick Taquiri Guerreros',
      status: 'active',
    },
    {
      name: 'Natalie Marleny Lazo Paxi',
      status: 'inactive',
    },
    {
      name: 'Jhosep Angel Cacsire Sanchez',
      status: 'inactive',
    },
  ];

  const roadmapTimeline = [
    {
      date: '5 de noviembre de 2025',
      members: [
        {
          name: 'Juan Carlos Postigo Cabana',
          status: 'active',
          done: [
            'Estructura inicial del proyecto y configuración de rutas',
            'Desarrollo de componentes compartidos (botones, layout)',
            'Integración del módulo de notas y asistencia docente',
          ],
          todo: [
            'Refactorizar estilos y mejorar experiencia de usuario',
            'Integrar persistencia de datos con el backend',
            'Documentar y automatizar despliegues',
          ],
        },
        {
          name: 'Leonardo Adriano Paxi Huayhua',
          status: 'active',
          done: ['Página de horario del docente', 'Módulo de reserva de ambientes'],
          todo: ['Completar estadísticas en el dashboard docente', 'Optimizar consultas con React Query'],
        },
        {
          name: 'Jorge Patrick Taquiri Guerreros',
          status: 'active',
          done: ['API de matrícula estudiantil', 'Servicios de consulta para calendario de clases'],
          todo: ['Endpoints de reserva de ambientes', 'Sincronización de datos con frontend'],
        },
        {
          name: 'Natalie Marleny Lazo Paxi',
          status: 'inactive',
          done: [],
          todo: [],
        },
        {
          name: 'Jhosep Angel Cacsire Sanchez',
          status: 'inactive',
          done: [],
          todo: [],
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
            'Implementación del backend con nueva tecnología',
            'Conexión del backend con el frontend',
            'Llenado parcial de datos en la base de datos para pruebas',
          ],
          todo: [],
        },
        {
          name: 'Leonardo Adriano Paxi Huayhua',
          status: 'active',
          done: ['Implementaciones en frontend para visualización de datos'],
          todo: [],
        },
        {
          name: 'Jorge Patrick Taquiri Guerreros',
          status: 'active',
          done: [
            'Revisión y corrección de bugs en el backend',
            'Levantamiento y listado de funcionalidades futuras',
          ],
          todo: [],
        },
      ],
    },
  ];

  const futureTasks = [
    'Completar funciones de Docente y reparar bugs menores',
    'Implementar autenticación por medio de correo institucinal',
    'Desplegar la base de datos en un entorno de producción',
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3"> Sistema Académico UNSA</h1>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6"> Equipo de Desarrollo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, i) => {
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              const isInactive = member.status === 'inactive';

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isInactive
                      ? 'bg-red-50/70 border-red-200 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isInactive ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">{member.name}</span>
                    {isInactive && (
                      <span className="text-[11px] uppercase tracking-wide font-semibold text-red-600">
                        Retirada/o del equipo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Roadmap del Proyecto</h2>

          <div className="space-y-8">
            {roadmapTimeline.map((block, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">{block.date}</h3>
                </div>
                <div className="space-y-6">
                  {block.members.map((member, i) => {
                    const isInactive = member.status === 'inactive';

                    return (
                      <div
                        key={i}
                        className={`rounded-lg p-4 border ${
                          isInactive
                            ? 'border-red-200 bg-red-50/60 text-red-800'
                            : 'border-gray-200 bg-white text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {member.name}
                          </h3>
                          {isInactive && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase tracking-wide">
                              Retirada/o
                            </span>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-green-700 mb-1 flex items-center gap-1">
                              <CheckCircle2 size={16} className="text-green-600" /> Avances
                            </h4>
                            {member.done && member.done.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1">
                                {member.done.map((task, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="mt-0.5 text-green-500" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Sin avances registrados en esta fecha.
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-yellow-700 mb-1 flex items-center gap-1">
                              <Circle size={16} className="text-yellow-600" /> Próximas tareas
                            </h4>
                            {member.todo && member.todo.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1">
                                {member.todo.map((task, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <Circle size={14} className="mt-0.5 text-yellow-500" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Sin tareas específicas registradas para esta fecha.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tareas generales a futuro */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <Code size={20} className="text-purple-600" /> Próximos pasos generales
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {futureTasks.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6"> Arquitectura del Proyecto</h2>
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
                  <h4 className="font-semibold text-blue-800 mb-1"> Presentación</h4>
                  <p className="text-sm text-gray-600">Pages y Components - Interfaz de usuario con React</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-1">⚙️ Aplicación</h4>
                  <p className="text-sm text-gray-600">Services y Hooks - Lógica de negocio y casos de uso</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-1"> Infraestructura</h4>
                  <p className="text-sm text-gray-600">API Client y Mocks - Comunicación con backend</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-1"> Estado</h4>
                  <p className="text-sm text-gray-600">Context y React Query - Gestión de estado global</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">Universidad Nacional de San Agustín de Arequipa</p>
          <p className="text-sm mt-1">Escuela Profesional de Ciencia de la Computación</p>
          <p className="text-xs mt-2 text-gray-500">Docente: Yessenia Deysi Yari Ramos</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocs;

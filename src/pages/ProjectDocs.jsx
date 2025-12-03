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

// --- ESTRUCTURA DEL FRONTEND  ---
const frontendStructure = {
  'src/': {
    type: 'folder',
    key: 'src',
    children: {
      'api/': { 
        type: 'folder', 
        key: 'src/api', 
        icon: <Cloud className="w-4 h-4 text-blue-500" />,
        children: { 'axiosClient.js': { type: 'file' }, 'endpoints.js': { type: 'file' } } 
      },
      'components/': {
        type: 'folder', 
        key: 'src/components',
        children: {
          'shared/': { 
            type: 'folder', 
            children: { 
              'NextClassCard.jsx': {type:'file'}, 
              'ScheduleTable.jsx': {type:'file'}, 
              'LoadingSpinner.jsx': {type:'file'} 
            } 
          },
          'student/': { type: 'folder' },
          'teacher/': { type: 'folder' },
          'admin/': { type: 'folder' },
        },
      },
      'context/': { type: 'folder', children: { 'AuthContext.jsx': { type: 'file' } } },
      'hooks/': { type: 'folder', children: { 'useAuth.js': { type: 'file' } } },
      'mocks/': { type: 'folder', icon: <Database className="w-4 h-4 text-yellow-500" /> },
      'pages/': {
        type: 'folder', 
        key: 'src/pages',
        children: {
          'student/': { 
            type: 'folder', 
            children: { 
              'StudentDashboard.jsx': {type:'file'}, 
              'StudentLabs.jsx': {type:'file'}, 
              'StudentGrades.jsx': {type:'file'},
              'StudentSchedule.jsx': {type:'file'}
            } 
          },
          'teacher/': { 
            type: 'folder', 
            children: { 
              'TeacherDashboard.jsx': {type:'file'}, 
              'GradeManagement.jsx': {type:'file'}, 
              'RoomReservation.jsx': {type:'file'},
              'AttendanceManagement.jsx': {type:'file'}
            } 
          },
          'admin/': {
            type: 'folder',
            children: {
              'AdminDashboard.jsx': { type: 'file' },
              'UserManagement.jsx': { type: 'file' },
              'SemesterManagement.jsx': { type: 'file' },
              'RoomManagement.jsx': { type: 'file' },
            }
          },
          'ProjectDocs.jsx': { type: 'file' }
        },
      },
      'services/': { 
        type: 'folder', 
        key: 'src/services', 
        icon: <Code className="w-4 h-4 text-green-500" />,
        children: { 
          'auth.service.js': {type:'file'}, 
          'student.service.js': {type:'file'}, 
          'teacher.service.js': {type:'file'},
          'admin.service.js': {type:'file'}
        }
      },
      'utils/': { 
        type: 'folder', 
        children: { 
          'constants.js': {type:'file'}, 
          'scheduleHelpers.js': {type:'file'} 
        } 
      },
      'App.jsx': { type: 'file' },
      'main.jsx': { type: 'file' },
    },
  },
};

// --- ESTRUCTURA DEL BACKEND ---
const backendStructure = {
  'src/': {
    type: 'folder',
    key: 'src',
    children: {
      'config/': { type: 'folder', children: { 'db.js': { type: 'file' } } },
      'controllers/': { 
        type: 'folder', 
        key: 'src/controllers', 
        icon: <Settings className="w-4 h-4 text-purple-500" />,
        children: { 
          'auth.controller.js': {type:'file'}, 
          'user.controller.js': {type:'file'}, 
          'course.controller.js': {type:'file'}, 
          'grade.controller.js': {type:'file'}, 
          'room.controller.js': {type:'file'},
          'teacher.controller.js': {type:'file'},
          'student.controller.js': {type:'file'},
          'semester.controller.js': {type:'file'},
          'lab.controller.js': {type:'file'},
        } 
      },
      'middlewares/': { type: 'folder', children: { 'validateToken.js': { type: 'file' } } },
      'models/': { 
        type: 'folder', 
        key: 'src/models', 
        icon: <Database className="w-4 h-4 text-green-600" />,
        children: { 
          'user.model.js': {type:'file'}, 
          'course.model.js': {type:'file'}, 
          'section.model.js': {type:'file'}, 
          'grade.model.js': {type:'file'},
          'room.model.js': {type:'file'},
          'roomReservation.model.js': {type:'file'},
          'semester.model.js': {type:'file'}
        } 
      },
      'routes/': { 
        type: 'folder', 
        key: 'src/routes', 
        icon: <Layers className="w-4 h-4 text-orange-500" />,
        children: { 
          'auth.routes.js': {type:'file'}, 
          'student.routes.js': {type:'file'}, 
          'teacher.routes.js': {type:'file'},
          'admin.routes.js': {type:'file'},
          'room.routes.js': {type:'file'},
          'lab.routes.js': {type:'file'},
          'semester.routes.js': {type:'file'},
        } 
      },
      'app.js': { type: 'file' },
      'server.js': { type: 'file' },
    },
  },
  'scripts/': { type: 'folder', children: { 'seed-demo.js': { type: 'file' } } },
  'vercel.json': { type: 'file' },
  '.env.example': { type: 'file' },
};

// --- EQUIPO ---
const teamMembers = [
  { name: 'Juan Carlos Postigo Cabana', status: 'active' },
  { name: 'Leonardo Adriano Paxi Huayhua', status: 'active' },
  { name: 'Jorge Patrick Taquiri Guerreros', status: 'active' },
  { name: 'Natalie Marleny Lazo Paxi', status: 'inactive' },
  { name: 'Jhosep Angel Cacsire Sanchez', status: 'inactive' },
];

// --- ROADMAP (Sprints) ---
const roadmapTimeline = [
  {
    date: '5 de noviembre de 2025',
    members: [
      {
        name: 'Juan Carlos Postigo Cabana',
        status: 'active',
        done: [
          'Diseño de arquitectura inicial del sistema',
          'Configuración de rutas base y layout principal',
          'Implementación de componentes core de navegación',
        ],
        todo: ['Refactorización de estilos globales', 'Integración de persistencia'],
      },
      {
        name: 'Leonardo Adriano Paxi Huayhua',
        status: 'active',
        done: ['Maquetación de horario docente', 'Prototipo de módulo de reservas'],
        todo: ['Optimización de consultas en vistas de horario'],
      },
      {
        name: 'Jorge Patrick Taquiri Guerreros',
        status: 'active',
        done: ['Endpoints básicos de matrícula y calendario'],
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
          'Reingeniería del backend (migración a arquitectura en capas)',
          'Implementación de seguridad JWT y middlewares de autorización',
          'Conexión cliente-servidor y manejo de CORS',
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
    date: '26 de noviembre de 2025',
    members: [
      {
        name: 'Juan Carlos Postigo Cabana',
        status: 'active',
        done: [
          'Despliegue de infraestructura cloud (Vercel + Atlas)',
          'Lógica de asistencia context-aware (IP, geolocalización, validaciones)',
          'Resolución de condiciones de carrera en notas (operaciones atómicas en BD)',
          'Refactorización de servicios y optimización de rendimiento',
        ],
        todo: ['Monitoreo de producción'],
      },
      {
        name: 'Leonardo Adriano Paxi Huayhua',
        status: 'active',
        done: ['Tarjetas de clase dinámicas en panel docente', 'Ajustes de UX en módulo de horarios'],
        todo: [],
      },
      {
        name: 'Jorge Patrick Taquiri Guerreros',
        status: 'active',
        done: ['Soporte en esquemas de reservas de aula', 'Validación de respuestas JSON en pruebas manuales'],
        todo: [],
      },
    ],
  },
  {
    date: '3 de diciembre de 2025 (Módulo Administrador)',
    members: [
      {
        name: 'Juan Carlos Postigo Cabana',
        status: 'active',
        done: [
          'Implementación completa del módulo Administrador en frontend (dashboard, usuarios, semestres, aulas)',
          'Integración de React Query en vistas administrativas y refactor de estados locales',
          'Diseño de flujos de gestión de semestres, cursos y secciones con reglas de no superposición',
          'Extensión del backend para dashboard admin y consulta de horarios de aula',
        ],
        todo: ['Pulido de estilos y ajuste fino de mensajes de error'],
      },
      {
        name: 'Leonardo Adriano Paxi Huayhua',
        status: 'active',
        done: [
          'Revisión de UX de panel administrativo',
          'Pruebas manuales de gestión de aulas y horarios desde la vista de admin',
        ],
        todo: [],
      },
      {
        name: 'Jorge Patrick Taquiri Guerreros',
        status: 'active',
        done: [
          'Verificación de consistencia entre modelos Course/Section/Semester',
          'Apoyo en documentación técnica de endpoints de cursos y secciones',
        ],
        todo: [],
      },
    ],
  },
];

// --- FUNCIONALIDADES DEL SISTEMA ---
const functionalities = [
  {
    category: 'Autenticación y usuarios',
    items: [
      {
        title: 'Login y control de acceso',
        status: 'implemented',
        roles: 'Todos',
        description:
          'Autenticación con email y contraseña, tokens JWT y autorización por rol (alumno, docente, secretaría, admin).',
      },
      {
        title: 'Gestión de usuarios',
        status: 'implemented',
        roles: 'Admin',
        description:
          'Creación de cuentas, edición de datos básicos, activación/desactivación y reseteo de contraseñas.',
      },
      {
        title: 'Acceso con correo institucional (Google)',
        status: 'pending',
        roles: 'Todos',
        description:
          'Vincular cuentas con correos institucionales para Single Sign-On. Definido en requisitos, pendiente de implementación en el front.',
      },
    ],
  },
  {
    category: 'Semestres, cursos y secciones',
    items: [
      {
        title: 'Gestión de semestres sin superposición',
        status: 'implemented',
        roles: 'Admin / Secretaría',
        description:
          'Creación y edición de semestres con validación de solapamiento: un solo semestre activo según la fecha actual.',
      },
      {
        title: 'Gestión de cursos base',
        status: 'implemented',
        roles: 'Admin / Secretaría',
        description:
          'Registro de cursos con código, nombre, créditos y horas teóricas/prácticas, reutilizables en distintos semestres.',
      },
      {
        title: 'Gestión de secciones por semestre',
        status: 'partial',
        roles: 'Secretaría',
        description:
          'Modelo de secciones con tipo (teoría/lab), grupo, docente, horario y aula. API disponible; UI de edición avanzada en progreso.',
      },
      {
        title: 'Carga inicial por Excel',
        status: 'pending',
        roles: 'Secretaría',
        description:
          'Carga masiva de alumnos, docentes, cursos y horarios mediante plantillas Excel. Definido en requisitos, sin UI en el front todavía.',
      },
    ],
  },
  {
    category: 'Horarios, aulas y reservas',
    items: [
      {
        title: 'Visualización de horarios (alumno/docente)',
        status: 'implemented',
        roles: 'Alumno / Docente',
        description:
          'Horario semanal con bloques por hora académica, tipo de clase y aula, integrado en los paneles de alumno y docente.',
      },
      {
        title: 'Gestión de aulas y aforos',
        status: 'implemented',
        roles: 'Admin',
        description:
          'Registro de aulas con nombre/código y capacidad. Vista por aula para analizar su ocupación semanal.',
      },
      {
        title: 'Reservas de aula por docentes',
        status: 'implemented',
        roles: 'Docente',
        description:
          'Reserva de aulas para actividades extra con validación de choques contra clases regulares y otras reservas.',
      },
    ],
  },
  {
    category: 'Laboratorios e inscripción interna',
    items: [
      {
        title: 'Grupos de laboratorio',
        status: 'partial',
        roles: 'Secretaría / Docente',
        description:
          'API para crear secciones tipo laboratorio con horario, docente, aula y aforo. UI de secretaría pendiente de pulir por completo.',
      },
      {
        title: 'Inscripción de alumnos a laboratorios',
        status: 'partial',
        roles: 'Alumno',
        description:
          'Módulo de alumno para registrar preferencias de horario de laboratorio y visualizar grupos disponibles.',
      },
      {
        title: 'Algoritmo de asignación automática',
        status: 'pending',
        roles: 'Secretaría',
        description:
          'Proceso por rondas, con balanceo de aforos y manejo de empates. Endpoint bosquejado, pero lógica aún no implementada.',
      },
    ],
  },
  {
    category: 'Asistencias y calificaciones',
    items: [
      {
        title: 'Registro de asistencia por sesión',
        status: 'implemented',
        roles: 'Docente',
        description:
          'Apertura de sesiones de asistencia y marcado de presente/ausente/tarde, con metadatos (IP, geolocalización aproximada).',
      },
      {
        title: 'Visor de asistencias y riesgo por faltas',
        status: 'partial',
        roles: 'Alumno',
        description:
          'Consulta de porcentaje de asistencias por curso. Cálculo de riesgo en progreso según reglas de la escuela.',
      },
      {
        title: 'Registro y consulta de notas',
        status: 'implemented',
        roles: 'Docente / Alumno',
        description:
          'Docente registra calificaciones por evaluación; alumno consulta notas y promedios por fase y curso.',
      },
    ],
  },
  {
    category: 'Reportes y analítica',
    items: [
      {
        title: 'Dashboard administrativo básico',
        status: 'implemented',
        roles: 'Admin',
        description:
          'Resumen con conteo de alumnos activos, docentes, cursos cargados y uso general del sistema.',
      },
      {
        title: 'Reportes descargables en PDF',
        status: 'pending',
        roles: 'Secretaría / Admin',
        description:
          'Listados de alumnos, cargas docentes, horarios y notas finales en PDF. Definido en requisitos, aún sin implementación UI.',
      },
      {
        title: 'Analítica avanzada de desempeño',
        status: 'pending',
        roles: 'Admin / Docentes',
        description:
          'Panel con métricas de avance de sílabo, alertas tempranas y comparativos. Planificado como fase posterior.',
      },
    ],
  },
];

// --- API VISUAL: módulos y endpoints principales ---
const apiSections = [
  {
    title: 'Autenticación',
    color: 'blue',
    icon: LogIn,
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        roles: 'Público',
        description: 'Iniciar sesión con email y contraseña. Devuelve JWT y datos básicos del usuario.',
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        roles: 'admin',
        description: 'Crear un nuevo usuario indicando nombre, email, contraseña, rol y código.',
      },
    ],
  },
  {
    title: 'Usuarios',
    color: 'indigo',
    icon: Users,
    endpoints: [
      {
        method: 'GET',
        path: '/api/users',
        roles: 'admin',
        description: 'Listar todos los usuarios registrados (sin contraseñas).',
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        roles: 'admin / usuario',
        description: 'Obtener datos de un usuario específico.',
      },
      {
        method: 'PUT',
        path: '/api/users/:id',
        roles: 'admin / usuario',
        description: 'Actualizar información básica del usuario.',
      },
      {
        method: 'DELETE',
        path: '/api/users/:id',
        roles: 'admin',
        description: 'Desactivar (soft delete) una cuenta de usuario.',
      },
    ],
  },
  {
    title: 'Semestres y cursos',
    color: 'green',
    icon: BookOpen,
    endpoints: [
      {
        method: 'GET',
        path: '/api/semesters',
        roles: 'admin / secretaría',
        description: 'Listar todos los semestres registrados.',
      },
      {
        method: 'POST',
        path: '/api/semesters',
        roles: 'admin / secretaría',
        description: 'Crear un nuevo semestre (sin superposición con otro activo).',
      },
      {
        method: 'PUT',
        path: '/api/semesters/:id',
        roles: 'admin / secretaría',
        description: 'Actualizar fechas de inicio/fin de un semestre activo o futuro.',
      },
      {
        method: 'GET',
        path: '/api/courses',
        roles: 'admin / secretaría / docente / alumno',
        description: 'Listar cursos disponibles.',
      },
      {
        method: 'POST',
        path: '/api/courses',
        roles: 'admin / secretaría',
        description: 'Crear un nuevo curso base con código y nombre.',
      },
      {
        method: 'PUT',
        path: '/api/courses/:id',
        roles: 'admin / secretaría',
        description: 'Actualizar datos de un curso existente.',
      },
      {
        method: 'DELETE',
        path: '/api/courses/:id',
        roles: 'admin / secretaría',
        description: 'Eliminar un curso (si no tiene dependencias activas).',
      },
      {
        method: 'GET',
        path: '/api/courses/:id/sections?semester=',
        roles: 'Todos',
        description: 'Obtener secciones (teoría/lab) de un curso para un semestre.',
      },
    ],
  },
  {
    title: 'Laboratorios e inscripción',
    color: 'purple',
    icon: Layers,
    endpoints: [
      {
        method: 'POST',
        path: '/api/labs/groups',
        roles: 'secretaría',
        description: 'Crear grupo de laboratorio (sección lab) con horario, docente, aula y aforo.',
      },
      {
        method: 'GET',
        path: '/api/labs/groups?course=&semester=',
        roles: 'alumno / secretaría / docente',
        description: 'Listar grupos de laboratorio de un curso en un semestre.',
      },
      {
        method: 'POST',
        path: '/api/labs/preferences',
        roles: 'alumno',
        description: 'Registrar preferencias de horarios para laboratorio.',
      },
      {
        method: 'POST',
        path: '/api/labs/assign',
        roles: 'secretaría',
        description: 'Ejecutar el algoritmo de asignación automática (pendiente de implementación).',
      },
    ],
  },
  {
    title: 'Asistencia',
    color: 'orange',
    icon: CheckCircle2,
    endpoints: [
      {
        method: 'POST',
        path: '/api/attendance',
        roles: 'docente',
        description: 'Abrir una nueva sesión de asistencia para una sección.',
      },
      {
        method: 'PATCH',
        path: '/api/attendance/:sessionId/entry/:studentId',
        roles: 'docente',
        description: 'Marcar presente/ausente/tarde para un estudiante.',
      },
      {
        method: 'GET',
        path: '/api/attendance?section=',
        roles: 'docente / alumno',
        description: 'Listar sesiones de asistencia filtradas por sección.',
      },
    ],
  },
  {
    title: 'Calificaciones',
    color: 'teal',
    icon: ShieldCheck,
    endpoints: [
      {
        method: 'POST',
        path: '/api/grades',
        roles: 'docente',
        description: 'Crear o actualizar una nota para un estudiante.',
      },
      {
        method: 'GET',
        path: '/api/grades?section=&summary=',
        roles: 'docente / alumno',
        description: 'Obtener notas de una sección y estadísticas (máx, mín, promedio).',
      },
    ],
  },
  {
    title: 'Aulas y reservas',
    color: 'red',
    icon: Server,
    endpoints: [
      {
        method: 'GET',
        path: '/api/rooms',
        roles: 'Todos',
        description: 'Listar todas las aulas registradas.',
      },
      {
        method: 'POST',
        path: '/api/rooms',
        roles: 'admin',
        description: 'Crear una nueva aula con nombre/código y aforo.',
      },
      {
        method: 'GET',
        path: '/api/rooms/:id/schedule',
        roles: 'admin / docente / secretaría',
        description: 'Consultar horario semanal combinado (clases y reservas) de un aula.',
      },
      {
        method: 'POST',
        path: '/api/rooms/reserve',
        roles: 'docente',
        description: 'Reservar un aula validando choques de horario.',
      },
      {
        method: 'GET',
        path: '/api/rooms/reservations?room=&date=',
        roles: 'docente / admin',
        description: 'Listar reservas existentes por aula y fecha.',
      },
    ],
  },
  {
    title: 'Dashboard administrativo',
    color: 'slate',
    icon: Layout,
    endpoints: [
      {
        method: 'GET',
        path: '/api/admin/dashboard',
        roles: 'admin',
        description: 'Obtener estadísticas globales: alumnos activos, docentes, cursos, uso del sistema.',
      },
    ],
  },
];

// --- HELPERS DE ESTILO ---
const getStatusStyles = (status) => {
  switch (status) {
    case 'implemented':
      return {
        badge: 'bg-green-100 text-green-700 border-green-200',
        card: 'border-green-100 bg-green-50/40',
        label: 'Implementado',
      };
    case 'partial':
      return {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        card: 'border-amber-50 bg-amber-50/30',
        label: 'En progreso',
      };
    case 'pending':
    default:
      return {
        badge: 'bg-gray-200 text-gray-600 border-gray-300',
        card: 'border-dashed border-gray-200 bg-gray-50 text-gray-500 opacity-80',
        label: 'Pendiente (sin UI en front)',
      };
  }
};

const getMethodClasses = (method) => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide';
  switch (method) {
    case 'GET':
      return `${base} bg-blue-100 text-blue-700`;
    case 'POST':
      return `${base} bg-green-100 text-green-700`;
    case 'PUT':
    case 'PATCH':
      return `${base} bg-amber-100 text-amber-700`;
    case 'DELETE':
      return `${base} bg-red-100 text-red-700`;
    default:
      return `${base} bg-gray-100 text-gray-600`;
  }
};

const getApiSectionBorder = (color) => {
  const base = 'bg-white rounded-2xl shadow-sm border';
  const map = {
    blue: `${base} border-blue-100`,
    indigo: `${base} border-indigo-100`,
    green: `${base} border-green-100`,
    purple: `${base} border-purple-100`,
    orange: `${base} border-orange-100`,
    teal: `${base} border-teal-100`,
    red: `${base} border-red-100`,
    slate: `${base} border-slate-100`,
  };
  return map[color] || `${base} border-gray-100`;
};

// --- COMPONENTE PRINCIPAL ---
const ProjectDocs = () => {
  const navigate = useNavigate();

  // Collapsables estructura código
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

  // Front/Back
  const [activeTab, setActiveTab] = useState('frontend');

  // Sprints colapsables
  const [openSprints, setOpenSprints] = useState({});

  const toggleFolder = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSprint = (index) => {
    setOpenSprints((prev) => {
      const current = prev[index] ?? (index === roadmapTimeline.length - 1);
      return { ...prev, [index]: !current };
    });
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
          onClick={() => node.key && toggleFolder(node.key)}
        >
          {node.key ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <div className="w-4" />
          )}
          {node.icon || <Folder className="w-4 h-4 text-blue-500" />}
          <span className="text-sm font-mono font-semibold text-gray-700">
            {name}
          </span>
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                  Release Candidate 1.6
                </span>
                <span className="flex items-center gap-1 text-green-300 text-xs font-bold uppercase tracking-wider">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-3 tracking-tight">
                Sistema Académico UNSA
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl font-light">
                Plataforma interna para gestión de matrícula, horarios, laboratorios, asistencia y calificaciones de la Escuela de Ciencia de la Computación.
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
              <LogIn size={20} className="group-hover:text-blue-800" />
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
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);
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
                      isInactive
                        ? 'bg-red-100 text-red-600'
                        : 'bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700'
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{member.name}</span>
                    {isInactive ? (
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wide mt-0.5">
                        Inactivo
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wide mt-0.5 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Activo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 1: Arquitectura del sistema */}
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
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeTab === 'frontend'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Frontend
                </button>
                <button
                  onClick={() => setActiveTab('backend')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeTab === 'backend'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Backend
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[500px]">
              {Object.entries(
                activeTab === 'frontend' ? frontendStructure : backendStructure
              ).map(([name, node]) => renderTree(node, name))}
            </div>
          </div>

          {/* Columna Derecha: Capas de Arquitectura */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Layers className="text-purple-600" /> Arquitectura de Software
              </h2>
              <p className="text-gray-600 mb-6">
                El sistema implementa una arquitectura{' '}
                <strong>Cliente-Servidor desacoplada</strong> basada en el stack
                MERN, diseñada para escalabilidad y mantenimiento modular.
              </p>
            </div>

            <div className="space-y-4">
              {/* Capa 1: Presentación */}
              <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-xl group-hover:bg-blue-600 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      Capa de Presentación (Frontend)
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      SPA reactiva construida con <strong>React 18 + Vite</strong>.
                      Utiliza <strong>React Query</strong> para la gestión del estado
                      del servidor y caché de datos, evitando la necesidad de Redux
                      para información remota.
                    </p>
                  </div>
                </div>
              </div>

              {/* Capa 2: API & Negocio */}
              <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-300">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500 rounded-l-xl group-hover:bg-purple-600 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Server size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      Capa de Aplicación (Backend API)
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      RESTful API en <strong>Node.js/Express</strong> con patrón{' '}
                      <em>Controller-Service</em>, separando la lógica de negocio
                      (cálculos, validaciones académicas) de la gestión de
                      peticiones HTTP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Capa 3: Persistencia */}
              <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-green-300">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-xl group-hover:bg-green-600 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      Capa de Persistencia (Data)
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Base de datos documental en <strong>MongoDB Atlas</strong>,
                      modelada con <strong>Mongoose</strong>. Relaciones entre
                      usuarios, secciones, notas y reservas garantizan integridad y
                      consultas eficientes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Capa 4: Seguridad */}
              <div className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-orange-300">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-xl group-hover:bg-orange-600 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      Seguridad & Infraestructura
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Autenticación <strong>stateless JWT</strong>, despliegue en
                      Vercel, CORS restringido y uso de variables de entorno para
                      proteger credenciales y configuración sensible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* SECCIÓN 5: Repositorios del Proyecto */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Code className="text-indigo-600" /> Repositorios del Proyecto
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Código fuente del sistema académico, separado en frontend y backend para
            facilitar el mantenimiento, el versionado y el despliegue independiente.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Frontend – Sistema Académico UNSA',
                type: 'Frontend React',
                url: 'https://github.com/tu-usuario/sistema-academico-frontend',
                description:
                  'SPA en React 18 + Vite con React Router, React Query y Tailwind, enfocada en paneles por rol (alumno, docente, admin).',
                tech: 'React, Vite, React Router, React Query, Tailwind CSS',
                source: 'GitHub',
              },
              {
                name: 'Backend – API Académica UNSA',
                type: 'Backend Node/Express',
                url: 'https://github.com/tu-usuario/sistema-academico-backend',
                description:
                  'API REST en Node.js/Express con JWT, Mongoose y arquitectura en capas para manejar usuarios, cursos, secciones y reservas.',
                tech: 'Node.js, Express, MongoDB Atlas, Mongoose, JWT',
                source: 'GitHub',
              },
              {
                name: 'Infraestructura & Docs',
                type: 'Infraestructura / Docs',
                url: 'https://https://sistema-academico-sooty.vercel.app/',
                description:
                  'Documentación técnica y notas de arquitectura del sistema.',
                tech: 'Vercel, Documentación',
                source: 'Web',
              },
            ].map((repo, idx) => (
              <a
                key={idx}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-linear-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        {repo.name}
                      </h3>
                      <p className="text-[11px] text-gray-500">{repo.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {repo.source}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {repo.description}
                </p>
                <p className="mt-3 text-[11px] text-gray-500">
                  <span className="font-semibold">Stack:</span> {repo.tech}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  Ver repositorio
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* SECCIÓN 2: Roadmap (Sprints colapsables) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <Settings className="text-purple-600" /> Roadmap & Progreso del Proyecto
          </h2>

          <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
            {roadmapTimeline.map((block, idx) => {
              const isOpen =
                openSprints[idx] ?? idx === roadmapTimeline.length - 1;
              return (
                <div key={idx} className="relative pl-12">
                  <div className="absolute left-[11px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-md" />
                  <button
                    type="button"
                    onClick={() => toggleSprint(idx)}
                    className="w-full flex items-center justify-between text-left mb-3 group"
                  >
                    <h3 className="text-lg font-bold text-gray-800">
                      {block.date}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="grid gap-6 lg:grid-cols-1">
                      {block.members.map((member, i) => {
                        if (member.status === 'inactive') return null;
                        return (
                          <div
                            key={i}
                            className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Circle className="w-3 h-3 text-blue-500" />
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
                                      <li
                                        key={j}
                                        className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-100 shadow-sm"
                                      >
                                        <CheckCircle2
                                          size={16}
                                          className="mt-0.5 text-green-500 shrink-0"
                                        />
                                        <span>{task}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {member.todo && member.todo.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">
                                    Pendiente
                                  </h5>
                                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                                    {member.todo.map((item, k) => (
                                      <li key={k}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

                {/* SECCIÓN 3: Funcionalidades del Sistema (Frontend / UX por rol) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Layout className="text-blue-600" /> Funcionalidades del Sistema
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Resumen de módulos funcionales disponibles en el sistema. Las tarjetas en{' '}
            <span className="font-semibold text-gray-500">gris</span> corresponden a
            características todavía no habilitadas en el frontend.
          </p>

          <div className="space-y-6">
            {functionalities.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-50/60 rounded-2xl border border-slate-100 p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {group.category}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Módulos y flujos relacionados a esta categoría funcional.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {group.items.map((item, i) => {
                    const statusStyles = getStatusStyles(item.status);
                    return (
                      <div
                        key={i}
                        className={`rounded-xl p-4 border text-sm transition-all ${statusStyles.card}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              <span className="font-semibold text-gray-600">
                                Roles:
                              </span>{' '}
                              {item.roles}
                            </p>
                          </div>
                          <span
                            className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyles.badge}`}
                          >
                            {statusStyles.label}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 4: Documentación de la API Backend */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Server className="text-purple-600" /> API Backend & Endpoints Principales
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            La API REST expone recursos para autenticación, usuarios, semestres, cursos,
            laboratorios, asistencia, calificaciones y reservas de aulas. A
            continuación se listan los endpoints clave por módulo.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className={getApiSectionBorder(section.color)}>
                  <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">
                          {section.title}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Grupo de endpoints relacionados.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {section.endpoints.map((ep, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={getMethodClasses(ep.method)}>
                            {ep.method}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide text-right">
                            {ep.roles}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-blue-700 break-all">
                          {ep.path}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-600 leading-snug">
                          {ep.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
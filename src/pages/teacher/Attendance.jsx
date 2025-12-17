import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  History
} from 'lucide-react';

import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';
import { getCurrentAcademicContext } from '../../utils/scheduleUtils';

const TeacherAttendance = () => {
  const qc = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [presentIds, setPresentIds] = useState(new Set());
  
  // Estado para el historial (filtros manuales)
  const [historyFilter, setHistoryFilter] = useState({ course: '', section: '' });

  // 1. CARGA DE DATOS INICIALES
  const { data: schedule = [], isLoading: loadingSch } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(), // Esto trae las SECCIONES ahora (según tu fix anterior)
  });

  // 2. DETECCIÓN DE CLASE ACTIVA ("MAGIC UX")
  const activeContext = useMemo(() => {
    if (!Array.isArray(schedule) || schedule.length === 0) return null;
    
    // Aplanamos el horario para buscar bloque por bloque
    const flatBlocks = [];
    schedule.forEach(section => {
        if(section.schedule) {
            section.schedule.forEach(slot => {
                flatBlocks.push({ ...slot, sectionData: section });
            });
        }
    });

    return getCurrentAcademicContext(flatBlocks);
  }, [schedule]);

  // Si hay una clase activa, configuramos el filtro del historial automáticamente
  useEffect(() => {
    if (activeContext && activeContext.type === 'REGULAR') {
        const sec = activeContext.data.sectionData;
        setHistoryFilter({ course: sec.course.code, section: sec.group });
    }
  }, [activeContext]);

  // 3. CARGA DE ROSTER (ALUMNOS) - Solo si hay clase activa
  const { data: roster = [], isLoading: loadingRoster } = useQuery({
    queryKey: ['roster', activeContext?.data?.sectionData?.course?.code, activeContext?.data?.sectionData?.group],
    queryFn: () => TeacherService.getRoster(
        activeContext.data.sectionData.course.code, 
        activeContext.data.sectionData.group // O section.section dependiendo de tu backend
    ),
    enabled: !!activeContext && !!activeSessionId, // Solo carga si abrimos sesión
  });

  // 4. CARGA DE HISTORIAL
  const { data: history = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['attendanceHistory', historyFilter.course, historyFilter.section],
    queryFn: () => TeacherService.listAttendanceSessions(historyFilter.course, historyFilter.section),
    enabled: !!historyFilter.course && !!historyFilter.section,
  });

  // --- MUTACIONES ---
  const openSessionMutation = useMutation({
    mutationFn: () => TeacherService.openAttendanceSession({
        courseCode: activeContext.data.sectionData.course.code,
        section: activeContext.data.sectionData.group, // O section
        // Enviamos metadata útil
        week: getCurrentWeekNumber(), // Función helper simple
        type: 'REGULAR'
    }),
    onSuccess: (res) => {
        // El backend debe devolver el ID de la sesión creada
        setActiveSessionId(res.id || res); 
        setPresentIds(new Set());
    }
  });

  const markMutation = useMutation({
    mutationFn: ({ studentId, status }) => TeacherService.markAttendance({
        sessionId: activeSessionId,
        studentId,
        status
    })
  });

  const closeSessionMutation = useMutation({
    mutationFn: () => TeacherService.closeAttendanceSession(activeSessionId),
    onSuccess: () => {
        setActiveSessionId(null);
        setPresentIds(new Set());
        qc.invalidateQueries(['attendanceHistory']); // Recargar historial
    }
  });

  // --- HANDLERS ---
  const handleToggle = (studentId) => {
    const newSet = new Set(presentIds);
    let status = 'ABSENT';
    
    if (newSet.has(studentId)) {
        newSet.delete(studentId);
    } else {
        newSet.add(studentId);
        status = 'PRESENT';
    }
    
    setPresentIds(newSet);
    // Optimistic UI: Marcamos visualmente antes de esperar al server, 
    // pero mandamos la petición en segundo plano.
    markMutation.mutate({ studentId, status });
  };

  if (loadingSch) return <LoadingSpinner message="Sincronizando reloj académico..." />;

  // --- RENDERIZADO ---
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* SECCIÓN 1: LO QUE PASA AHORA (Active Context) */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-blue-600" />
            Clase en Curso
        </h1>

        {activeContext ? (
            <div className="bg-white border-l-4 border-blue-600 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                            Ahora Mismo
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">
                            {activeContext.data.sectionData.course?.name}
                        </h2>
                        <div className="flex gap-4 mt-2 text-gray-600 text-sm">
                            <span className="flex items-center gap-1">
                                <Users size={16} /> Grupo {activeContext.data.sectionData.group}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={16} /> 
                                {activeContext.data.room?.name || activeContext.data.room?.code || 'Aula Virtual'}
                            </span>
                        </div>
                    </div>

                    {/* BOTÓN DE ACCIÓN PRINCIPAL */}
                    {!activeSessionId ? (
                        <button 
                            onClick={() => openSessionMutation.mutate()}
                            disabled={openSessionMutation.isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                        >
                            {openSessionMutation.isLoading ? 'Iniciando...' : 'Iniciar Toma de Asistencia'}
                        </button>
                    ) : (
                        <button 
                            onClick={() => closeSessionMutation.mutate()}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Finalizar Sesión
                        </button>
                    )}
                </div>

                {/* ZONA DE TOMA DE LISTA */}
                {activeSessionId && (
                    <div className="mt-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-700">Listado de Alumnos</h3>
                            <div className="text-sm text-gray-500">
                                <span className="font-bold text-green-600">{presentIds.size}</span> Presentes
                            </div>
                        </div>

                        {loadingRoster ? (
                            <div className="p-8 text-center text-gray-500">Cargando lista...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {roster.map(student => (
                                    <div 
                                        key={student.id}
                                        onClick={() => handleToggle(student.id)}
                                        className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all ${
                                            presentIds.has(student.id)
                                                ? 'bg-green-50 border-green-200 shadow-sm'
                                                : 'bg-gray-50 border-gray-100 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-semibold ${presentIds.has(student.id) ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {student.name.split(',')[0]} {/* Solo nombre/apellido corto */}
                                            </span>
                                            <span className="text-xs text-gray-400">{student.code}</span>
                                        </div>
                                        {presentIds.has(student.id) ? (
                                            <CheckCircle className="text-green-500" size={24} />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            // ESTADO: NO HAY CLASE AHORA
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-gray-400" size={32} />
                </div>
                <h2 className="text-lg font-semibold text-gray-600">No tienes clases programadas en este momento</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Relájate o revisa el historial de asistencias abajo.
                </p>
            </div>
        )}
      </section>

      {/* SECCIÓN 2: HISTORIAL (Siempre visible pero secundario) */}
      <section className="pt-8 border-t">
        <div className="flex items-center gap-2 mb-4">
            <History className="text-gray-500" />
            <h2 className="text-xl font-bold text-gray-700">Historial de Sesiones</h2>
        </div>
        
        {/* Selector simple para ver historial de otros cursos */}
        <div className="flex gap-4 mb-4">
            <select 
                className="border rounded-md px-3 py-2 text-sm bg-white"
                value={historyFilter.course}
                onChange={(e) => setHistoryFilter(prev => ({ ...prev, course: e.target.value }))}
            >
                <option value="">Seleccionar Curso</option>
                {/* Lógica simple para listar cursos únicos del horario */}
                {Array.from(new Set(schedule.map(s => s.course?.code))).map(code => (
                    <option key={code} value={code}>{code}</option>
                ))}
            </select>
             {/* Aquí podrías poner el selector de sección si es necesario */}
        </div>

        {historyFilter.course ? (
            loadingHistory ? <LoadingSpinner /> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Semana</th>
                                <th className="px-6 py-3">Asistencia</th>
                                <th className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No hay registros para este curso.
                                    </td>
                                </tr>
                            ) : (
                                history.map(session => (
                                    <tr key={session.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {new Date(session.openedAt).toLocaleDateString()}
                                            <span className="text-gray-400 text-xs block">
                                                {new Date(session.openedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">Semana {session.week || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-500 h-2 rounded-full" 
                                                        style={{ width: `${(session.presentCount / (session.totalStudents || 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {session.presentCount}/{session.totalStudents}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                session.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {session.status === 'OPEN' ? 'Abierta' : 'Cerrada'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )
        ) : (
            <div className="text-gray-400 text-sm italic">Selecciona un curso para ver su historial.</div>
        )}
      </section>

    </div>
  );
};

// Función auxiliar simple para la semana (puedes mejorarla según tu calendario real)
const getCurrentWeekNumber = () => {
    const startOfSemester = new Date('2025-08-15'); // Fecha inicio semestre
    const now = new Date();
    const diff = now - startOfSemester;
    const week = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    return week > 0 ? week : 1;
};

export default TeacherAttendance;
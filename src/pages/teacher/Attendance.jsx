// Página de toma de asistencia para el docente. Permite seleccionar un curso,
// sección y bloque horario, abrir una sesión de asistencia, marcar presentes
// y ver un resumen de las sesiones anteriores. Se agregó soporte para
// almacenar la semana de cada sesión y mostrar un resumen con conteo de
// presentes y ausentes por semana.

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const Attendance = () => {
  // Estado de selección
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [presentIds, setPresentIds] = useState(new Set());
  const qc = useQueryClient();

  // Cargar horario del docente
  const {
    data: schedule,
    isLoading: loadingSchedule,
    error: errorSchedule,
  } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  // Obtener roster (lista de estudiantes) cuando se haya seleccionado curso/sección
  const {
    data: roster,
    isLoading: loadingRoster,
    error: errorRoster,
  } = useQuery({
    queryKey: ['teacherRoster', selectedCourse, selectedSection],
    queryFn: () => {
      if (!selectedCourse || !selectedSection) return [];
      return TeacherService.getRoster(selectedCourse, selectedSection);
    },
    enabled: !!selectedCourse && !!selectedSection,
  });

  // Consultar sesiones anteriores para resumen
  const {
    data: sessions,
    isLoading: loadingSessions,
    error: errorSessions,
  } = useQuery({
    queryKey: ['attendanceSessions', selectedCourse, selectedSection, sessionId],
    queryFn: () => {
      if (!selectedCourse || !selectedSection) return [];
      return TeacherService.listAttendanceSessions(selectedCourse, selectedSection);
    },
    enabled: !!selectedCourse && !!selectedSection,
  });

  // Mutaciones para abrir sesión, marcar y cerrar
  const openSession = useMutation({
    mutationFn: () =>
      TeacherService.openAttendanceSession({
        courseCode: selectedCourse,
        section: selectedSection,
        blockId: selectedBlock?.id,
      }),
    onSuccess: (newSessionId) => {
      setSessionId(newSessionId);
      setPresentIds(new Set());
      qc.invalidateQueries({ queryKey: ['attendanceSessions', selectedCourse, selectedSection] });
    },
  });
  const mark = useMutation({
    mutationFn: ({ studentId, status }) =>
      TeacherService.markAttendance({
        sessionId,
        studentId,
        status,
      }),
  });
  const closeSession = useMutation({
    mutationFn: () => TeacherService.closeAttendanceSession(sessionId),
    onSuccess: () => {
      setSessionId(null);
      qc.invalidateQueries({ queryKey: ['attendanceSessions', selectedCourse, selectedSection] });
    },
  });

  if (loadingSchedule) return <LoadingSpinner message="Cargando horario..." />;
  if (errorSchedule) return <ErrorMessage message="Error al cargar horario" />;

  // Agrupar bloques por curso+sección
  const courses = {};
  schedule.forEach((b) => {
    const key = `${b.courseCode}-${b.section}`;
    if (!courses[key]) courses[key] = { courseCode: b.courseCode, section: b.section, blocks: [] };
    courses[key].blocks.push(b);
  });

  const handleTogglePresence = (studentId) => {
    const updated = new Set(presentIds);
    if (presentIds.has(studentId)) {
      updated.delete(studentId);
    } else {
      updated.add(studentId);
    }
    setPresentIds(updated);
    mark.mutate({ studentId, status: updated.has(studentId) ? 'PRESENT' : 'ABSENT' });
  };

  // Construir resumen de sesiones para mostrar presentes/ausentes
  const sessionSummaries = (sessions ?? []).map((sess) => {
    const present = sess.records.filter((r) => r.status === 'PRESENT').length;
    const absent = roster && roster.length ? roster.length - present : 0;
    return { ...sess, present, absent };
  });

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-xl font-semibold">Registro de Asistencia</h1>

      {/* Selector de curso/sección y bloque */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Curso y Sección</label>
          <select
            className="border rounded p-2"
            value={selectedCourse && selectedSection ? `${selectedCourse}-${selectedSection}` : ''}
            onChange={(e) => {
              const [courseCode, section] = e.target.value.split('-');
              setSelectedCourse(courseCode);
              setSelectedSection(section);
              setSelectedBlock(null);
              setSessionId(null);
            }}
          >
            <option value="">Seleccione curso</option>
            {Object.values(courses).map((c) => (
              <option key={`${c.courseCode}-${c.section}`} value={`${c.courseCode}-${c.section}`}>
                {c.courseCode} - Sección {c.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Horario</label>
          <select
            className="border rounded p-2"
            value={selectedBlock?.id ?? ''}
            onChange={(e) => {
              const block = courses[`${selectedCourse}-${selectedSection}`]?.blocks.find(
                (b) => b.id === e.target.value,
              );
              setSelectedBlock(block);
            }}
            disabled={!selectedCourse}
          >
            <option value="">Seleccione horario</option>
            {selectedCourse &&
              courses[`${selectedCourse}-${selectedSection}`]?.blocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.day} {b.startTime}-{b.endTime}
                </option>
              ))}
          </select>
        </div>

        {/* Botón abrir/cerrar sesión */}
        {sessionId ? (
          <button onClick={() => closeSession.mutate()} className="btn-danger">
            Cerrar sesión
          </button>
        ) : (
          <button
            onClick={() => openSession.mutate()}
            disabled={!selectedCourse || !selectedBlock}
            className="btn-primary"
          >
            Abrir sesión
          </button>
        )}
      </div>

      {/* Lista de estudiantes para la sesión actual */}
      {sessionId && (
        <div className="bg-white rounded border p-4">
          {loadingRoster ? (
            <LoadingSpinner message="Cargando lista de alumnos..." />
          ) : errorRoster ? (
            <ErrorMessage message="Error al cargar lista" />
          ) : (
            <>
              <h2 className="font-semibold mb-2">Lista de estudiantes (Semana {sessions?.find((s) => s.id === sessionId)?.week})</h2>
              <ul className="divide-y">
                {roster.map((stu) => (
                  <li key={stu.id} className="flex justify-between items-center py-2">
                    <span>
                      {stu.code} - {stu.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={presentIds.has(stu.id)}
                      onChange={() => handleTogglePresence(stu.id)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Resumen de sesiones anteriores */}
      {!sessionId && sessions && sessions.length > 0 && (
        <div className="bg-white rounded border p-4">
          <h2 className="font-semibold mb-2">Resumen de Asistencias</h2>
          {loadingSessions ? (
            <LoadingSpinner message="Cargando sesiones..." />
          ) : errorSessions ? (
            <ErrorMessage message="Error al cargar sesiones" />
          ) : (
            <table className="w-full text-sm border divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Semana</th>
                  <th className="p-2 text-left">Fecha apertura</th>
                  <th className="p-2 text-left">Presentes</th>
                  <th className="p-2 text-left">Faltantes</th>
                  <th className="p-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sessionSummaries.map((sess) => (
                  <tr key={sess.id} className="hover:bg-gray-50">
                    <td className="p-2">Semana {sess.week}</td>
                    <td className="p-2">
                      {new Date(sess.openedAt).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-2">{sess.present}</td>
                    <td className="p-2">{sess.absent}</td>
                    <td className="p-2">{sess.status === 'OPEN' ? 'Abierta' : 'Cerrada'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
// src/pages/teacher/Attendance.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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

  // Cargar horario del docente
  const { data: schedule, isLoading: loadingSchedule, error: errorSchedule } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  // Obtener roster (lista de estudiantes) cuando se haya seleccionado curso/sección y bloque
  const { data: roster, isLoading: loadingRoster, error: errorRoster } = useQuery({
    queryKey: ['teacherRoster', selectedCourse, selectedSection],
    queryFn: () => {
      if (!selectedCourse || !selectedSection) return [];
      return TeacherService.getRoster(selectedCourse, selectedSection);
    },
    enabled: !!selectedCourse && !!selectedSection,
  });

  // Mutaciones para abrir sesión, marcar y cerrar
  const openSession = useMutation({
    mutationFn: () => TeacherService.openAttendanceSession({
      courseCode: selectedCourse,
      section: selectedSection,
      blockId: selectedBlock?.id,
    }),
    onSuccess: (newSessionId) => {
      setSessionId(newSessionId);
      setPresentIds(new Set());
    },
  });
  const mark = useMutation({
    mutationFn: ({ studentId, status }) => TeacherService.markAttendance({
      sessionId,
      studentId,
      status,
    }),
  });
  const closeSession = useMutation({
    mutationFn: () => TeacherService.closeAttendanceSession(sessionId),
    onSuccess: () => setSessionId(null),
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

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-xl font-semibold">Registro de Asistencia</h1>

      {/* Selector de curso/sección */}
      <div className="flex gap-4">
      <select
        className="border rounded p-2"
        value={`${selectedCourse}-${selectedSection}`}
        onChange={(e) => {
          const [courseCode, section] = e.target.value.split('-');
          setSelectedCourse(courseCode);
          setSelectedSection(section);
          setSelectedBlock(null);
        }}
      >
        <option value="">Seleccione curso</option>
        {Object.values(courses).map((c) => (
          <option key={`${c.courseCode}-${c.section}`} value={`${c.courseCode}-${c.section}`}>
            {c.courseCode} - Sección {c.section}
          </option>
        ))}
      </select>

      {/* Selector de bloque */}
      <select
        className="border rounded p-2"
        value={selectedBlock?.id ?? ''}
        onChange={(e) => {
          const block = courses[`${selectedCourse}-${selectedSection}`]?.blocks.find((b) => b.id === e.target.value);
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

      {/* Lista de estudiantes */}
      {sessionId && (
        <div className="bg-white rounded border p-4">
          {loadingRoster ? (
            <LoadingSpinner message="Cargando lista de alumnos..." />
          ) : errorRoster ? (
            <ErrorMessage message="Error al cargar lista" />
          ) : (
            <>
              <h2 className="font-semibold mb-2">Lista de estudiantes</h2>
              <ul className="divide-y">
                {roster.map((stu) => (
                  <li key={stu.id} className="flex justify-between items-center py-2">
                    <span>{stu.code} - {stu.name}</span>
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
    </div>
  );
};

export default Attendance;

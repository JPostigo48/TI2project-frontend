// src/pages/teacher/GradeManagement.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const GradeManagement = () => {
  const [courseCode, setCourseCode] = useState('');
  const [section, setSection] = useState('');
  const qc = useQueryClient();

  // Cargar horario para extraer cursos/sections
  const { data: schedule, isLoading: loadingSchedule, error: errorSchedule } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  // Obtener resumen de notas al seleccionar curso y sección
  const { data: summary, isLoading: loadingSummary, error: errorSummary } = useQuery({
    queryKey: ['gradesSummary', courseCode, section],
    queryFn: () => {
      if (!courseCode || !section) return [];
      return TeacherService.getGradesSummary(courseCode, section);
    },
    enabled: !!courseCode && !!section,
  });

  const setGrade = useMutation({
    mutationFn: TeacherService.setGrade,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gradesSummary', courseCode, section] }),
  });
  const setSub = useMutation({
    mutationFn: TeacherService.setSubstitutive,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gradesSummary', courseCode, section] }),
  });

  if (loadingSchedule) return <LoadingSpinner message="Cargando datos..." />;
  if (errorSchedule) return <ErrorMessage message="Error al cargar horario" />;

  // Extraer cursos únicos de schedule
  const courses = {};
  schedule.forEach((b) => {
    const key = `${b.courseCode}-${b.section}`;
    if (!courses[key]) courses[key] = { courseCode: b.courseCode, section: b.section };
  });

  const handleGradeChange = (studentId, partial, kind, value) => {
    setGrade.mutate({ courseCode, section, studentId, partial, kind, value });
  };
  const handleSubChange = (studentId, value) => {
    setSub.mutate({ courseCode, section, studentId, value });
  };

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-xl font-semibold">Gestión de Notas</h1>
      <div className="flex gap-4">
        <select
          className="border rounded p-2"
          value={`${courseCode}-${section}`}
          onChange={(e) => {
            const [c, s] = e.target.value.split('-');
            setCourseCode(c);
            setSection(s);
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

      {loadingSummary && courseCode && section && <LoadingSpinner message="Cargando notas..." />}
      {errorSummary && <ErrorMessage message="Error al cargar notas" />}

      {summary && summary.length > 0 && (
        <table className="w-full border divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-2">Alumno</th>
              <th className="p-2">P1 Cont.</th>
              <th className="p-2">P1 Exam.</th>
              <th className="p-2">P2 Cont.</th>
              <th className="p-2">P2 Exam.</th>
              <th className="p-2">P3 Cont.</th>
              <th className="p-2">P3 Exam.</th>
              <th className="p-2">Sustit.</th>
              <th className="p-2">Final</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={row.studentId} className="text-sm hover:bg-gray-50">
                <td className="p-2 font-medium">{row.studentName}</td>
                {['P1', 'P2', 'P3'].map((partial) => (
                  <React.Fragment key={partial}>
                    <td className="p-1">
                      <input
                        type="number"
                        className="w-16 border rounded p-1"
                        defaultValue={row.partials[partial].continuous}
                        onBlur={(e) => handleGradeChange(row.studentId, partial, 'continuous', e.target.value)}
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        className="w-16 border rounded p-1"
                        defaultValue={row.partials[partial].exam}
                        onBlur={(e) => handleGradeChange(row.studentId, partial, 'exam', e.target.value)}
                      />
                    </td>
                  </React.Fragment>
                ))}
                <td className="p-1">
                  <input
                    type="number"
                    className="w-16 border rounded p-1"
                    defaultValue={row.substitutive ?? ''}
                    onBlur={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value);
                      handleSubChange(row.studentId, v);
                    }}
                  />
                </td>
                <td className="p-2 font-semibold">
                  {row.computed.finalScore?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GradeManagement;

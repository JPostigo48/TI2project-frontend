// Página para gestionar las notas de los estudiantes por parte del docente.
// Permite seleccionar un curso/sección, visualizar las notas y editar/guardar
// cambios en bloque. Se agregó un modo de edición para que las notas no se
// envíen al backend hasta que el docente presione "Guardar". Mientras no
// esté en modo edición, los valores se muestran de solo lectura.

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const GradeManagement = () => {
  const [courseCode, setCourseCode] = useState('');
  const [section, setSection] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState([]);
  const qc = useQueryClient();

  // Cargar horario para extraer cursos/sections
  const {
    data: schedule,
    isLoading: loadingSchedule,
    error: errorSchedule,
  } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  // Obtener resumen de notas al seleccionar curso y sección
  const {
    data: summary,
    isLoading: loadingSummary,
    error: errorSummary,
  } = useQuery({
    queryKey: ['gradesSummary', courseCode, section],
    queryFn: () => {
      if (!courseCode || !section) return [];
      return TeacherService.getGradesSummary(courseCode, section);
    },
    enabled: !!courseCode && !!section,
  });

  // Mutaciones para actualizar notas
  const setGrade = useMutation({
    mutationFn: TeacherService.setGrade,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gradesSummary', courseCode, section] });
    },
  });
  const setSub = useMutation({
    mutationFn: TeacherService.setSubstitutive,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gradesSummary', courseCode, section] });
    },
  });

  // Cuando cambia el resumen original, reiniciar los estados de edición
  useEffect(() => {
    if (summary && summary.length > 0) {
      // Profunda clonación para evitar modificar summary directamente
      const cloned = summary.map((row) => ({
        studentId: row.studentId,
        studentName: row.studentName,
        partials: JSON.parse(JSON.stringify(row.partials)),
        substitutive: row.substitutive,
        computed: row.computed,
      }));
      setEditSummary(cloned);
      setIsEditing(false);
    } else {
      setEditSummary([]);
    }
  }, [summary]);

  if (loadingSchedule) return <LoadingSpinner message="Cargando datos..." />;
  if (errorSchedule) return <ErrorMessage message="Error al cargar horario" />;

  // Extraer cursos únicos de schedule
  const courses = {};
  schedule.forEach((b) => {
    const key = `${b.courseCode}-${b.section}`;
    if (!courses[key]) courses[key] = { courseCode: b.courseCode, section: b.section };
  });

  // Manejar cambios en campos de nota mientras se edita
  const handleEditChange = (rowIndex, partial, kind, value) => {
    const updated = [...editSummary];
    updated[rowIndex] = {
      ...updated[rowIndex],
      partials: {
        ...updated[rowIndex].partials,
        [partial]: {
          ...updated[rowIndex].partials[partial],
          [kind]: value === '' ? '' : Number(value),
        },
      },
    };
    setEditSummary(updated);
  };
  const handleEditSubChange = (rowIndex, value) => {
    const updated = [...editSummary];
    updated[rowIndex] = {
      ...updated[rowIndex],
      substitutive: value === '' ? null : Number(value),
    };
    setEditSummary(updated);
  };

  // Guardar cambios realizados en modo edición
  const handleSave = async () => {
    // Recorrer cada fila y detectar cambios respecto a summary
    for (let i = 0; i < editSummary.length; i++) {
      const original = summary[i];
      const edited = editSummary[i];
      // Comparar parciales
      for (const partialKey of ['P1', 'P2', 'P3']) {
        const origP = original.partials[partialKey];
        const editP = edited.partials[partialKey];
        if (Number(origP.continuous) !== Number(editP.continuous)) {
          await setGrade.mutateAsync({
            courseCode,
            section,
            studentId: edited.studentId,
            partial: partialKey,
            kind: 'continuous',
            value: editP.continuous,
          });
        }
        if (Number(origP.exam) !== Number(editP.exam)) {
          await setGrade.mutateAsync({
            courseCode,
            section,
            studentId: edited.studentId,
            partial: partialKey,
            kind: 'exam',
            value: editP.exam,
          });
        }
      }
      // Comparar sustitutorio
      const origSub = original.substitutive;
      const editSub = edited.substitutive;
      if ((origSub ?? null) !== (editSub ?? null)) {
        await setSub.mutateAsync({
          courseCode,
          section,
          studentId: edited.studentId,
          value: editSub,
        });
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-xl font-semibold">Gestión de Notas</h1>
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Curso y sección</label>
          <select
            className="border rounded p-2"
            value={courseCode && section ? `${courseCode}-${section}` : ''}
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
        {summary && summary.length > 0 && (
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Editar notas
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="btn-success">
                  Guardar
                </button>
                <button
                  onClick={() => {
                    // Cancelar restaurando datos originales
                    const cloned = summary.map((row) => ({
                      studentId: row.studentId,
                      studentName: row.studentName,
                      partials: JSON.parse(JSON.stringify(row.partials)),
                      substitutive: row.substitutive,
                      computed: row.computed,
                    }));
                    setEditSummary(cloned);
                    setIsEditing(false);
                  }}
                  className="btn-danger"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {loadingSummary && courseCode && section && <LoadingSpinner message="Cargando notas..." />}
      {errorSummary && <ErrorMessage message="Error al cargar notas" />}

      {summary && summary.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Alumno</th>
                {['P1', 'P2', 'P3'].map((p) => (
                  <React.Fragment key={p}>
                    <th className="p-2 text-left">{p} Cont.</th>
                    <th className="p-2 text-left">{p} Exam.</th>
                  </React.Fragment>
                ))}
                <th className="p-2 text-left">Sustit.</th>
                <th className="p-2 text-left">Final</th>
              </tr>
            </thead>
            <tbody>
              {editSummary.map((row, rowIndex) => (
                <tr key={row.studentId} className="hover:bg-gray-50">
                  <td className="p-2 font-medium whitespace-nowrap">{row.studentName}</td>
                  {['P1', 'P2', 'P3'].map((partial) => (
                    <React.Fragment key={partial}>
                      <td className="p-1">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-16 border rounded p-1"
                            value={row.partials[partial].continuous}
                            onChange={(e) =>
                              handleEditChange(rowIndex, partial, 'continuous', e.target.value)
                            }
                          />
                        ) : (
                          <span>{row.partials[partial].continuous}</span>
                        )}
                      </td>
                      <td className="p-1">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-16 border rounded p-1"
                            value={row.partials[partial].exam}
                            onChange={(e) =>
                              handleEditChange(rowIndex, partial, 'exam', e.target.value)
                            }
                          />
                        ) : (
                          <span>{row.partials[partial].exam}</span>
                        )}
                      </td>
                    </React.Fragment>
                  ))}
                  <td className="p-1">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-16 border rounded p-1"
                        value={row.substitutive ?? ''}
                        onChange={(e) => handleEditSubChange(rowIndex, e.target.value)}
                      />
                    ) : (
                      <span>{row.substitutive ?? '-'}</span>
                    )}
                  </td>
                  <td className="p-2 font-semibold">
                    {row.computed?.finalScore != null ? row.computed.finalScore.toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;
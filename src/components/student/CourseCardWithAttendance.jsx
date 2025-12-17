// components/student/CourseCardWithAttendance.jsx
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  User,
  CalendarCheck2,
  AlertTriangle,
} from 'lucide-react';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../shared/layout/LoadingSpinner';
import ErrorMessage from '../shared/layout/ErrorMessage';

const pct = (n) => `${Math.round((Number(n) || 0) * 10) / 10}%`;

const AttendanceBadge = ({ value }) => {
  // value: 0..100
  const v = Number(value) || 0;

  const cls =
    v >= 90
      ? 'bg-green-50 text-green-700 border-green-200'
      : v >= 75
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : v >= 60
      ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
      : 'bg-red-50 text-red-700 border-red-200';

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>
      Asistencia: {pct(v)}
    </span>
  );
};

/**
 * Esperamos que getCourseAttendance(courseId) devuelva algo así:
 * {
 *   courseId,
 *   summary: { present: 10, absent: 2, late: 1, total: 13, attendancePct: 76.9 },
 *   records: [
 *     { date: "2025-10-03", status: "present"|"absent"|"late", note?: "" }
 *   ]
 * }
 *
 * Si tu backend devuelve otro shape, ajusta el mapeo.
 */
const CourseCardWithAttendance = ({ course }) => {
  const [open, setOpen] = useState(false);

  const courseId = course.courseId || course._id || course.course;
  const courseName = course.courseName || course.name || 'Curso';
  const courseCode = course.courseCode || course.code || '';
  const teacherName = course.teacherName || course.teacher?.name || '';

  const metaLine = useMemo(() => {
    const parts = [];
    if (teacherName) parts.push(teacherName);
    if (course.group) parts.push(`Grupo ${course.group}`);
    if (course.credits) parts.push(`${course.credits} créditos`);
    return parts.join(' · ');
  }, [teacherName, course.group, course.credits]);

  const {
    data: attendance,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['studentAttendanceByCourse', courseId],
    queryFn: () => StudentService.getCourseAttendance(courseId),
    enabled: open && !!courseId,
    staleTime: 1000 * 60 * 1,
  });

  const summary = attendance?.summary || null;
  const records = Array.isArray(attendance?.records) ? attendance.records : [];

  const attendancePctValue =
    summary?.attendancePct ??
    (summary?.total
      ? (Number(summary.present || 0) / Number(summary.total)) * 100
      : null);

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div>
          <p className="font-semibold text-gray-900">
            {courseCode ? `${courseCode} — ` : ''}
            {courseName}
          </p>
          {metaLine && <p className="text-xs text-gray-500 mt-1">{metaLine}</p>}

          {/* mini status */}
          {typeof attendancePctValue === 'number' && (
            <div className="mt-2">
              <AttendanceBadge value={attendancePctValue} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-gray-500">
            {open ? 'Ocultar asistencia' : 'Ver asistencia'}
          </span>
          {open ? (
            <ChevronUp className="text-gray-600" />
          ) : (
            <ChevronDown className="text-gray-600" />
          )}
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
          {isLoading ? (
            <LoadingSpinner message="Cargando asistencia..." />
          ) : error ? (
            <div className="space-y-2">
              <ErrorMessage message="No se pudo cargar tu asistencia para este curso." />
              <button
                type="button"
                onClick={() => refetch()}
                className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Summary */}
              {summary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="border rounded-lg p-2">
                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                      <CalendarCheck2 size={14} />
                      Total
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {summary.total ?? records.length ?? 0}
                    </div>
                  </div>

                  <div className="border rounded-lg p-2">
                    <div className="text-[11px] text-gray-500">Asistencias</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {summary.present ?? 0}
                    </div>
                  </div>

                  <div className="border rounded-lg p-2">
                    <div className="text-[11px] text-gray-500">Faltas</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {summary.absent ?? 0}
                    </div>
                  </div>

                  <div className="border rounded-lg p-2">
                    <div className="text-[11px] text-gray-500">Tardanzas</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {summary.late ?? 0}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                  No hay resumen disponible. Mostrando registros si existen.
                </div>
              )}

              {/* Records */}
              {records.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Aún no hay registros de asistencia para este curso.
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
                    Registros
                  </div>
                  <div className="divide-y">
                    {records.slice(0, 20).map((r, idx) => {
                      const label =
                        r.status === 'present'
                          ? 'Asistió'
                          : r.status === 'late'
                          ? 'Tarde'
                          : r.status === 'absent'
                          ? 'Faltó'
                          : r.status || '—';

                      const pill =
                        r.status === 'present'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : r.status === 'late'
                          ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                          : r.status === 'absent'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200';

                      return (
                        <div key={`${r.date || idx}-${idx}`} className="px-3 py-2 flex items-center justify-between gap-3">
                          <div className="text-sm text-gray-900">
                            {r.date ? new Date(r.date).toLocaleDateString() : '—'}
                            {r.note ? (
                              <span className="text-xs text-gray-500 ml-2">
                                ({r.note})
                              </span>
                            ) : null}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${pill}`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {records.length > 20 && (
                    <div className="px-3 py-2 text-xs text-gray-500 bg-white">
                      Mostrando 20 de {records.length}. (Puedes implementar paginación si lo necesitas)
                    </div>
                  )}
                </div>
              )}

              {/* small footer actions */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  Datos del curso y asistencia
                </div>
                {isFetching && <span>Actualizando...</span>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCardWithAttendance;

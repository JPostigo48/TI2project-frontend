// pages/student/StudentCourses.jsx
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, ChevronDown } from 'lucide-react';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';
import CourseCardWithAttendance from '../../components/student/CourseCardWithAttendance';

const StudentCourses = () => {
  const [q, setQ] = useState('');

  const {
    data: courses = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['studentMyCourses'],
    queryFn: () => StudentService.getMyCourses(),
    staleTime: 1000 * 60 * 2,
  });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return courses;

    return courses.filter((c) => {
      const code = (c.courseCode || c.code || '').toLowerCase();
      const name = (c.courseName || c.name || '').toLowerCase();
      const teacher = (c.teacherName || c.teacher?.name || '').toLowerCase();
      return (
        code.includes(query) || name.includes(query) || teacher.includes(query)
      );
    });
  }, [courses, q]);

  if (isLoading) return <LoadingSpinner message="Cargando tus cursos..." />;
  if (error)
    return (
      <ErrorMessage message="No se pudieron cargar tus cursos. Intenta nuevamente." />
    );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold">Mis Cursos</h1>
            <p className="text-sm text-gray-600">
              Revisa tus cursos matriculados y consulta tu asistencia por curso.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-xs text-gray-500">Actualizando...</span>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Recargar
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="card">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por código, nombre o docente..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="card text-center py-10 text-gray-500">
          No tienes cursos matriculados (o no coinciden con la búsqueda).
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <CourseCardWithAttendance key={course.courseId || course._id} course={course} />
          ))}
        </div>
      )}

      {/* Small hint */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <ChevronDown size={14} />
        Tip: abre un curso para ver tu asistencia sin salir de esta página.
      </div>
    </div>
  );
};

export default StudentCourses;

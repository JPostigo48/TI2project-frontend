// pages/student/StudentLabs.jsx
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FlaskConical } from 'lucide-react';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';
import LabCourseCard from '../../components/student/LabCourseCard';
import Notice from '../../components/shared/layout/Notice';

const StudentLabs = () => {
  const {
    data: labsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['studentLabs'],
    queryFn: () => StudentService.getAvailableLabs(),
  });

  const labGroups = useMemo(() => {
    if (!labsResponse) return [];
    if (Array.isArray(labsResponse)) return labsResponse;
    return labsResponse.labGroups || [];
  }, [labsResponse]);

  const labEnrollmentStatus = labsResponse?.labEnrollmentStatus || 'open';
  const labWindow = labsResponse?.labEnrollmentWindow || null;
  const studentSchedule = labsResponse?.studentSchedule || [];

  // Agrupar labs por curso (igual que antes)
  const courses = useMemo(() => {
    const map = new Map();
    labGroups.forEach((g) => {
      if (!g) return;
      const courseObj = g.course || {};
      const courseId = courseObj._id || g.courseId || g.course;
      if (!courseId) return;

      const existing = map.get(courseId);
      if (!existing) {
        map.set(courseId, {
          courseId,
          semesterId: g.semester || g.semesterId || null,
          courseCode: courseObj.code || g.courseCode || '',
          courseName: courseObj.name || g.courseName || 'Curso sin nombre',
          groups: [g],
        });
      } else {
        existing.groups.push(g);
      }
    });
    return Array.from(map.values());
  }, [labGroups]);

  const isPhaseNotStarted = labEnrollmentStatus === 'not_started';
  const isPhaseOpen = labEnrollmentStatus === 'open';
  const isPhaseProcessed = labEnrollmentStatus === 'processed';

  if (isLoading) {
    return <LoadingSpinner message="Cargando laboratorios..." />;
  }

  if (error) {
    return <ErrorMessage message="Error al cargar laboratorios." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <FlaskConical className="text-blue-600" />
        <h1 className="text-xl font-semibold">Matrícula de Laboratorios</h1>
      </div>

      {/* AVISO GENERAL SEGÚN FASE */}
      <Notice>
        {isPhaseNotStarted && (
          <>
            <p>
              La matrícula de laboratorios aún no está habilitada. Por ahora solo
              puedes revisar qué cursos tienen laboratorio asignado.
            </p>
            {labWindow?.opensAt && (
              <p className="text-xs text-gray-700 mt-1">
                Inicio estimado:{' '}
                {new Date(labWindow.opensAt).toLocaleString()}
              </p>
            )}
          </>
        )}

        {isPhaseOpen && (
          <>
            <p>
              La matrícula de laboratorios está <strong>abierta</strong>. Selecciona
              los grupos en orden de prioridad (1 = mayor prioridad) para cada curso
              con laboratorio y guarda tus preferencias.
            </p>
            {labWindow?.closesAt && (
              <p className="text-xs text-gray-700 mt-1">
                Recuerda guardar tus preferencias antes de:{' '}
                {new Date(labWindow.closesAt).toLocaleString()}.
              </p>
            )}
          </>
        )}

        {isPhaseProcessed && (
          <p>
            Las matrículas de laboratorios ya fueron procesadas. Revisa en cada curso
            el <span className="font-semibold">grupo marcado en verde</span> para ver
            dónde has sido asignado.
          </p>
        )}
      </Notice>

      {/* LISTA DE CURSOS CON LABORATORIO */}
      {courses.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          No tienes cursos con laboratorios disponibles.
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <LabCourseCard
              key={course.courseId}
              course={course}
              labEnrollmentStatus={labEnrollmentStatus}
              studentSchedule={studentSchedule}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLabs;

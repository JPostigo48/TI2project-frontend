import React, { useMemo } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../../api/axiosClient';
import ENDPOINTS from '../../../api/endpoints';

import CourseSectionsManager from './CoursesSectionsManager';
import ErrorMessage from '../layout/ErrorMessage';
import LoadingSpinner from '../layout/LoadingSpinner';
import NewCourseCard from './NewCourseCard';

const CoursesPanel = ({
  semesters,
  selectedSemesterId,
  onChangeSelectedSemester,
  courses,
  loadingCourses,
  errorCourses,
  teachers,
  loadingTeachers,
  errorTeachers,
  rooms,
  loadingRooms,
  errorRooms,
  showCourseForm,
  onToggleCourseForm,
  courseForm,
  courseFormStatus,
  courseFormMessage,
  creatingCourse,
  onCourseInputChange,
  onCreateCourse,
  onEditCourse,
}) => {
  const qc = useQueryClient();

  const loadingEverything = loadingCourses || loadingTeachers || loadingRooms;
  const errorGeneral = errorCourses || errorTeachers || errorRooms;

  // ============================
  // Secciones por curso+semestre
  // ============================
  const sectionsQueries = useQueries({
    queries: (courses || []).map((course) => ({
      queryKey: ['courseSections', course._id, selectedSemesterId],
      enabled: !!selectedSemesterId && !!course?._id && !loadingEverything && !errorGeneral,
      staleTime: 1000 * 60 * 2,
      queryFn: async () => {
        const res = await axiosClient.get(
          ENDPOINTS.ADMIN.SECTIONS_IN_COURSE(course._id),
          { params: { semester: selectedSemesterId } }
        );
        return res.data || [];
      },
    })),
  });

  const loadingSections = sectionsQueries.some((q) => q.isLoading);
  const errorSections = sectionsQueries.some((q) => q.error);

  // ✅ Filtrar cursos: solo los que tienen secciones en el semestre seleccionado
  const coursesWithSections = useMemo(() => {
    if (!selectedSemesterId) return [];

    return (courses || [])
      .map((course, idx) => ({
        course,
        sections: sectionsQueries[idx]?.data || [],
        isLoading: sectionsQueries[idx]?.isLoading || false,
        error: sectionsQueries[idx]?.error || null,
      }))
      .filter((x) => (x.sections || []).length > 0);
  }, [courses, sectionsQueries, selectedSemesterId]);

  const refetchSectionsForCourse = async (courseId) => {
    if (!selectedSemesterId) return;
    await qc.invalidateQueries(['courseSections', courseId, selectedSemesterId]);
  };

  return (
    <div className="bg-white p-4 shadow rounded space-y-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-1">
        <div>
          <h2 className="text-lg font-semibold">Cursos y grupos</h2>
          <p className="text-xs text-gray-500">
            Elige un semestre y gestiona los grupos (teoría / laboratorio) de cada curso.
          </p>
        </div>

        <select
          value={selectedSemesterId}
          onChange={(e) => onChangeSelectedSemester(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {semesters.map((sem) => (
            <option key={sem._id} value={sem._id}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      {/* LOADER / ERROR GLOBAL */}
      {loadingEverything ? (
        <LoadingSpinner message="Cargando cursos y configuración..." />
      ) : errorGeneral ? (
        <ErrorMessage message="No se pudieron cargar los cursos o la configuración necesaria. Verifica el servidor." />
      ) : !selectedSemesterId ? (
        <p className="text-sm text-gray-500">Selecciona un semestre para continuar.</p>
      ) : loadingSections ? (
        <LoadingSpinner message="Cargando cursos del semestre..." />
      ) : errorSections ? (
        <ErrorMessage message="Error al cargar las secciones del semestre seleccionado." />
      ) : (
        <>
          {/* LISTA FILTRADA */}
          {coursesWithSections.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay cursos con secciones registradas para este semestre.
            </p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {coursesWithSections.map(({ course, sections, isLoading, error }) => (
                <CourseSectionsManager
                  key={course._id}
                  course={course}
                  semesterId={selectedSemesterId}
                  onEditCourse={onEditCourse}
                  teachers={teachers}
                  rooms={rooms}
                  sections={sections}
                  isLoading={isLoading}
                  error={error}
                  refetchSections={() => refetchSectionsForCourse(course._id)}
                />
              ))}
            </div>
          )}

          <NewCourseCard
            showCourseForm={showCourseForm}
            courseForm={courseForm}
            onCourseInputChange={onCourseInputChange}
            onCreateCourse={onCreateCourse}
            creatingCourse={creatingCourse}
            onCancel={onToggleCourseForm}
            courseFormStatus={courseFormStatus}
            courseFormMessage={courseFormMessage}
            onToggleCourseForm={onToggleCourseForm}
          />
        </>
      )}
    </div>
  );
};

export default CoursesPanel;

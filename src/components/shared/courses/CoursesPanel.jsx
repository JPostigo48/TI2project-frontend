import React from 'react';
import CourseSectionsManager from './CoursesSectionsManager';
import StatusCard from '../common/StatusCard';
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

  // 🔥 Loader global: si falta cualquiera de los datasets
  const loadingEverything = loadingCourses || loadingTeachers || loadingRooms;

  // 🔥 Error unificado: si algo falló en cualquiera
  const errorGeneral = errorCourses || errorTeachers || errorRooms;

  return (
    <div className="bg-white p-4 shadow rounded space-y-4">

      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-1">
        <div>
          <h2 className="text-lg font-semibold">Cursos y grupos</h2>
          <p className="text-xs text-gray-500">
            Elige un semestre y gestiona los grupos (teoría / laboratorio)
            de cada curso.
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

      {/* ============================================
            LOADER o ERROR GLOBAL
      ============================================ */}
      {loadingEverything ? (
        <LoadingSpinner message="Cargando cursos y configuración..." />
      ) : errorGeneral ? (
        <ErrorMessage message="No se pudieron cargar los cursos o la configuración necesaria. Verifica el servidor." />
      ) : (

        /* ============================================
              CONTENIDO NORMAL (si todo cargó bien)
        ============================================ */
        <>

          {/* LISTA DE CURSOS */}
          {courses.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no hay cursos registrados.</p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {courses.map((course) => (
                <CourseSectionsManager
                  key={course._id}
                  course={course}
                  semesterId={selectedSemesterId}
                  onEditCourse={onEditCourse}
                  teachers={teachers}
                  rooms={rooms}
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

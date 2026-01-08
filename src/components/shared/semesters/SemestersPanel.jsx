import React from 'react';
import ErrorMessage from '../layout/ErrorMessage';
import LoadingSpinner from '../layout/LoadingSpinner';
import NewSemesterCard from './NewSemesterCard';
import SemesterItem from './SemesterItem';
import LabResultsModal from '../../admin/LabsResultsModal';

const SemestersPanel = ({
  semesters,
  activeSemester,
  showSemesterForm,
  onToggleSemesterForm,
  semesterForm,
  semesterFormStatus,
  semesterFormMessage,
  creatingSemester,
  onSemesterInputChange,
  onCreateSemester,
  onOpenEditSemester,
  formatDateUTC,
  getSemesterStatus,
  editSemester,
  editSemesterStatus,
  editSemesterMessage,
  onEditSemesterChange,
  onCancelEditSemester,
  onSaveSemesterDates,
  loadingSemesters,
  errorSemesters,
  labActionStatus,
  labActionMessage,
  onStartLabsEnrollment,
  onCloseLabsEnrollment,
  onViewLabsResults,
}) => {
  if (loadingSemesters) {
    return (
      <div className="bg-white p-4 shadow rounded space-y-4">
        <h2 className="text-lg font-semibold">Semestres académicos</h2>
        <LoadingSpinner message="Cargando semestres..." />
      </div>
    );
  }

  if (errorSemesters) {
    return (
      <div className="bg-white p-4 shadow rounded space-y-4">
        <h2 className="text-lg font-semibold">Semestres académicos</h2>
        <ErrorMessage message="Error al cargar semestres. Intenta nuevamente." />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow rounded space-y-4">
      <h2 className="text-lg font-semibold">Semestres académicos</h2>


      {/* Lista de semestres */}
      <ul className="space-y-3">
        {semesters.map((sem) => {
          const status = getSemesterStatus(sem);
          const isEditing = editSemester && editSemester._id === sem._id;

          const labEnrollmentStatus = sem.labEnrollment?.status || 'not_started';

          return (
            <SemesterItem
              key={sem._id}
              sem={sem}
              status={status}
              formatDateUTC={formatDateUTC}
              isEditing={isEditing}
              editSemester={editSemester}
              editSemesterStatus={editSemesterStatus}
              editSemesterMessage={editSemesterMessage}
              onEditClick={() => onOpenEditSemester(sem)}
              onEditSemesterChange={onEditSemesterChange}
              onCancelEditSemester={onCancelEditSemester}
              onSaveSemesterDates={onSaveSemesterDates}
              labEnrollmentStatus={labEnrollmentStatus}
              labActionStatus={labActionStatus}
              labActionMessage={labActionMessage}
              onStartLabsEnrollment={() => onStartLabsEnrollment(sem)}
              onCloseLabsEnrollment={() => onCloseLabsEnrollment(sem)}
              onViewLabsResults={() => onViewLabsResults(sem)}
            />
          );
        })}
      </ul>

      {/* Crear semestre (tarjeta aparte) */}
      <NewSemesterCard
        activeSemester={activeSemester}
        showSemesterForm={showSemesterForm}
        onToggleSemesterForm={onToggleSemesterForm}
        semesterForm={semesterForm}
        semesterFormStatus={semesterFormStatus}
        semesterFormMessage={semesterFormMessage}
        creatingSemester={creatingSemester}
        onSemesterInputChange={onSemesterInputChange}
        onCreateSemester={onCreateSemester}
      />
    </div>
  );
};

export default SemestersPanel;

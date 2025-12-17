import React from 'react';
import EditSemesterCard from './EditSemesterCard';
import LabEnrollmentControls from './LabEnrollmentControls';
import ErrorMessage from '../layout/ErrorMessage';

const SemesterItem = ({
  sem,
  status,                // 'active' | 'future' | 'past'
  formatDateUTC,
  isEditing,             // editSemester && editSemester._id === sem._id
  editSemester,
  editSemesterStatus,
  editSemesterMessage,
  onEditClick,           // () => onOpenEditSemester(sem)
  onEditSemesterChange,
  onCancelEditSemester,
  onSaveSemesterDates,
  // para laboratorios
  labEnrollmentStatus,   // 'not_started' | 'open' | 'processed'
  labActionStatus,
  labActionMessage,
  onStartLabsEnrollment,
  onCloseLabsEnrollment,
  onViewLabsResults,
}) => {
  const statusLabel =
    status === 'active' ? 'Activo' : status === 'future' ? 'Futuro' : 'Pasado';

  const statusColor =
    status === 'active'
      ? 'bg-green-100 text-green-700'
      : status === 'future'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-600';

  const canEditDates = status === 'active' || status === 'future';

  return (
    <li className="border rounded-lg p-3 bg-white shadow-sm">
      {/* Info principal del semestre */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="font-medium">
            {sem.name}{' '}
            {status === 'active' && (
              <span className="ml-1 text-[10px] uppercase tracking-wide text-green-700">
                (Semestre actual)
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {formatDateUTC(sem.startDate)} – {formatDateUTC(sem.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>
          {canEditDates && (
            <button
              type="button"
              onClick={onEditClick}
              className="text-xs text-blue-600 hover:underline"
            >
              Editar fechas
            </button>
          )}
        </div>
      </div>

      {/* Editar semestre (debajo del semestre en edición) */}
      {isEditing && (
        <div className="mt-2">
          <EditSemesterCard
            editSemester={editSemester}
            editSemesterStatus={editSemesterStatus}
            editSemesterMessage={editSemesterMessage}
            onEditSemesterChange={onEditSemesterChange}
            onCancelEditSemester={onCancelEditSemester}
            onSaveSemesterDates={onSaveSemesterDates}
          />
        </div>
      )}

      {/* Mensajes de acción de laboratorios SOLO para el semestre ACTIVO */}
      {status === 'active' && labActionStatus === 'error' && (
        <div className="mt-2">
          <ErrorMessage message={labActionMessage} />
        </div>
      )}

      {status === 'active' && labActionStatus === 'success' && (
        <p className="mt-2 text-xs text-green-700">{labActionMessage}</p>
      )}

      {/* Controles de matrícula de laboratorios SOLO para el semestre ACTIVO */}
      {status === 'active' && labEnrollmentStatus && (
        <LabEnrollmentControls
          status={labEnrollmentStatus}
          onStart={onStartLabsEnrollment}
          onClose={onCloseLabsEnrollment}
          onViewResults={onViewLabsResults}
        />
      )}
    </li>
  );
};

export default SemesterItem;

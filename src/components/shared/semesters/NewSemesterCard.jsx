import React from 'react';
import StatusCard from '../common/StatusCard';
import ErrorMessage from '../layout/ErrorMessage';

const NewSemesterCard = ({
  activeSemester,
  showSemesterForm,
  onToggleSemesterForm,
  semesterForm,
  semesterFormStatus,
  semesterFormMessage,
  creatingSemester,
  onSemesterInputChange,
  onCreateSemester,
}) => {
  const hasActiveSemester = Boolean(activeSemester);

  const isBlockedByActiveSemester = showSemesterForm && hasActiveSemester;
  
  const disableForm = creatingSemester || hasActiveSemester;

  return (
    <StatusCard
      status={
        isBlockedByActiveSemester
          ? 'error'
          : showSemesterForm
          ? semesterFormStatus
          : 'idle'
      }
      dashed
    >
      {/* NO se permite crear semestre porque ya hay uno activo */}
      {isBlockedByActiveSemester ? (
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-red-700">
            No se puede crear un nuevo semestre
          </h3>

          <ErrorMessage
            message={`Ya existe un semestre activo (${activeSemester.name}). Ajusta su fecha de fin antes de crear uno nuevo.`}
          />

          <button
            type="button"
            onClick={onToggleSemesterForm}
            className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      ) : showSemesterForm ? (
        /* Formulario normal */
        <form onSubmit={onCreateSemester} className="space-y-3">
          <h3 className="text-md font-semibold">Crear nuevo semestre</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              name="name"
              value={semesterForm.name}
              onChange={onSemesterInputChange}
              placeholder="Nombre (e.g., 2025-A)"
              className="border p-2 rounded"
              required
              disabled={disableForm}
            />
            <input
              type="date"
              name="startDate"
              value={semesterForm.startDate}
              onChange={onSemesterInputChange}
              className="border p-2 rounded"
              required
              disabled={disableForm}
            />
            <input
              type="date"
              name="endDate"
              value={semesterForm.endDate}
              onChange={onSemesterInputChange}
              className="border p-2 rounded"
              required
              disabled={disableForm}
            />
          </div>

          {semesterFormMessage &&
            (semesterFormStatus === 'error' ? (
              <ErrorMessage message={semesterFormMessage} />
            ) : (
              <p className="text-xs text-green-700">{semesterFormMessage}</p>
            ))}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={disableForm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {creatingSemester ? 'Creando...' : 'Crear semestre'}
            </button>
            <button
              type="button"
              onClick={onToggleSemesterForm}
              className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        /* Botón para abrir el formulario */
        <button
          type="button"
          onClick={onToggleSemesterForm}
          className="w-full text-xs text-gray-600 hover:text-gray-800 flex items-center justify-center py-2"
        >
          <span className="inline-flex items-center gap-1">
            <span className="text-base leading-none">+</span>
            <span>Crear nuevo semestre</span>
          </span>
        </button>
      )}
    </StatusCard>
  );
};

export default NewSemesterCard;

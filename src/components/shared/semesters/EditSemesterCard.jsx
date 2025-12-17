import StatusCard from '../common/StatusCard';
import ErrorMessage from '../layout/ErrorMessage';

const EditSemesterCard = ({ 
  editSemester,
  editSemesterStatus,
  editSemesterMessage,
  onEditSemesterChange,
  onCancelEditSemester,
  onSaveSemesterDates,
}) => {
  

  return (
    <StatusCard
          status={editSemesterStatus || 'editing'}
          className="space-y-3 p-4"
        >
          <form onSubmit={onSaveSemesterDates} className="space-y-3">
            <h2 className="text-md font-semibold">
              Editar fechas de {editSemester.name}{' '}
              <span className="text-xs uppercase text-gray-500">
                ({editSemester.status === 'active'
                  ? 'Semestre activo'
                  : 'Semestre futuro'}
                )
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={editSemester.startDate}
                  onChange={onEditSemesterChange}
                  className="border p-2 rounded w-full"
                  disabled={editSemester.status === 'active'}
                />
                {editSemester.status === 'active' && (
                  <p className="text-xs text-gray-400 mt-1">
                    No se puede modificar el inicio de un semestre ya iniciado.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={editSemester.endDate}
                  onChange={onEditSemesterChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>

            {editSemesterMessage && (
              editSemesterStatus === 'error' ? (
                <ErrorMessage message={editSemesterMessage} />
              ) : (
                <p className="text-xs text-green-700">
                  {editSemesterMessage}
                </p>
              )
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onCancelEditSemester}
                className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </StatusCard>
  );
};

export default EditSemesterCard;

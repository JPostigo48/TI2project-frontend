import React from 'react';
import SectionSchedulesFields from './SectionScheduleFields';

const NewGroupCard = ({
  semesterId,
  groupForm,
  creatingGroup,
  showGroupForm,
  teachers,
  rooms,
  onChange, // recibe eventos "sintéticos" con { target: { name, value } }
  onSubmit,
  onCancel,
}) => {
  const schedules = groupForm.schedules || [];

  const handleSchedulesChange = (newSchedules) => {
    onChange({
      target: { name: 'schedules', value: newSchedules },
    });
  };

  return (
    <div className="border border-dashed border-gray-300 rounded-md bg-gray-50 p-3">
      {showGroupForm ? (
        <form onSubmit={onSubmit} className="space-y-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">
            Nuevo grupo para este semestre
          </p>

          {/* Datos generales del grupo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <select
              name="type"
              value={groupForm.type}
              onChange={onChange}
              className="border p-2 rounded text-sm"
            >
              <option value="theory">Teoría</option>
              <option value="lab">Laboratorio</option>
            </select>

            <input
              type="text"
              name="group"
              value={groupForm.group}
              onChange={onChange}
              placeholder="Grupo (A, B, 01)"
              className="border p-2 rounded text-sm"
              required
            />

            <input
              type="number"
              name="capacity"
              value={groupForm.capacity}
              onChange={onChange}
              placeholder="Capacidad"
              className="border p-2 rounded text-sm"
              min={0}
            />

            <select
              name="teacher"
              value={groupForm.teacher}
              onChange={onChange}
              className="border p-2 rounded text-sm"
              required
            >
              <option value="">Docente</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName || t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Horarios */}
          <SectionSchedulesFields
            schedules={schedules}
            rooms={rooms}
            onChangeSchedules={handleSchedulesChange}
          />

          {/* Botones finales */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creatingGroup || !semesterId}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {creatingGroup ? 'Creando grupo...' : 'Agregar grupo'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-xs text-gray-600 hover:text-gray-800 flex items-center justify-center py-2"
        >
          <span className="inline-flex items-center gap-1">
            <span className="text-base leading-none">+</span>
            <span>Nuevo grupo para este curso</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default NewGroupCard;

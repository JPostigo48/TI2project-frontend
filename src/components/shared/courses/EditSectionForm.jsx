import React from 'react';
import SectionSchedulesFields from '../schedule/SectionScheduleFields';

const EditSectionForm = ({
  editingSection,
  editSectionForm,
  teachers,
  rooms,
  onChange,
  onCancel,
  onSubmit,
}) => {
  if (!editingSection) return null;

  const schedules = editSectionForm.schedules || [];

  const handleSchedulesChange = (newSchedules) => {
    onChange({
      target: { name: 'schedules', value: newSchedules },
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-xs font-semibold text-gray-700">
        Editando grupo {editingSection.group}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <select
          name="type"
          value={editSectionForm.type}
          onChange={onChange}
          className="border p-2 rounded text-sm"
        >
          <option value="theory">Teoría</option>
          <option value="lab">Laboratorio</option>
        </select>
        <input
          type="text"
          name="group"
          value={editSectionForm.group}
          onChange={onChange}
          placeholder="Grupo"
          className="border p-2 rounded text-sm"
          required
        />
        <input
          type="number"
          name="capacity"
          value={editSectionForm.capacity}
          onChange={onChange}
          placeholder="Capacidad"
          className="border p-2 rounded text-sm"
          min={0}
        />
        <select
          name="teacher"
          value={editSectionForm.teacher}
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

      {/* Horarios (reutilizado) */}
      <SectionSchedulesFields
        schedules={schedules}
        rooms={rooms}
        onChangeSchedules={handleSchedulesChange}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-20 px-3 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-30 px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default EditSectionForm;

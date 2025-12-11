import React from 'react';
import { ACADEMIC_HOUR_OPTIONS } from '../../utils/constants';
import { getTimeRangeFromBlocks } from '../../utils/scheduleUtils';

const EMPTY_SCHEDULE = { dayOfWeek: '', startBlock: '', endBlock: '', room: '' };

const SectionSchedulesFields = ({ schedules = [], rooms = [], onChangeSchedules }) => {
  const localSchedules = schedules.length > 0 ? schedules : [EMPTY_SCHEDULE];

  const updateScheduleField = (index, field, value) => {
    const updated = localSchedules.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChangeSchedules(updated);
  };

  const handleStartBlockChange = (index, e) => {
    const value = e.target.value;
    updateScheduleField(index, 'startBlock', value);

    const newStart = Number(value || 0);
    const currentEnd = Number(localSchedules[index]?.endBlock || 0);

    if (localSchedules[index]?.endBlock && currentEnd < newStart) {
      updateScheduleField(index, 'endBlock', '');
    }
  };

  const handleEndBlockChange = (index, e) => {
    updateScheduleField(index, 'endBlock', e.target.value);
  };

  const handleDayChange = (index, e) => {
    updateScheduleField(index, 'dayOfWeek', e.target.value);
  };

  const handleRoomChange = (index, e) => {
    updateScheduleField(index, 'room', e.target.value);
  };

  const handleAddSchedule = () => {
    const updated = [...localSchedules, { ...EMPTY_SCHEDULE }];
    onChangeSchedules(updated);
  };

  const handleRemoveSchedule = (index) => {
    const updated = localSchedules.filter((_, i) => i !== index);
    onChangeSchedules(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">
          {localSchedules.length <= 1
            ? 'Horario:'
            : `Horarios (${localSchedules.length}):`}
        </span>
      </div>

      {localSchedules.map((schedule, index) => {
        const endBlockOptions = schedule.startBlock
          ? ACADEMIC_HOUR_OPTIONS.filter(
              (b) => b.value >= Number(schedule.startBlock)
            )
          : [];

        return (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border border-gray-200 rounded-md p-2 bg-white"
          >
            {/* Día */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">Día</span>
              <select
                value={schedule.dayOfWeek}
                onChange={(e) => handleDayChange(index, e)}
                className="border p-2 rounded text-sm"
                required
              >
                <option value="">Día de la semana</option>
                <option value="Monday">Lunes</option>
                <option value="Tuesday">Martes</option>
                <option value="Wednesday">Miércoles</option>
                <option value="Thursday">Jueves</option>
                <option value="Friday">Viernes</option>
              </select>
            </div>

            {/* Bloques inicio/fin */}
            <div className="flex flex-row gap-1">
              <select
                value={schedule.startBlock}
                onChange={(e) => handleStartBlockChange(index, e)}
                className="border p-2 rounded text-sm flex-1"
                required
              >
                <option value="">Bloque inicio</option>
                {ACADEMIC_HOUR_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>

              <select
                value={schedule.endBlock}
                onChange={(e) => handleEndBlockChange(index, e)}
                className="border p-2 rounded text-sm flex-1"
                required
                disabled={!schedule.startBlock}
              >
                <option value="">
                  {schedule.startBlock ? 'Bloque fin' : 'Primero el inicio'}
                </option>
                {endBlockOptions.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview horas */}
            <input
              type="text"
              readOnly
              className="border p-2 rounded bg-gray-100 text-gray-700 text-xs md:text-sm text-center font-medium"
              value={
                getTimeRangeFromBlocks(
                  schedule.startBlock,
                  schedule.endBlock
                ) || 'Selecciona bloques para ver horario'
              }
            />

            {/* Aula + botón eliminar (si hay más de un horario) */}
            <div className="flex gap-1">
              <select
                value={schedule.room}
                onChange={(e) => handleRoomChange(index, e)}
                className="border p-2 rounded text-sm flex-1"
                required
              >
                <option value="">Aula</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name || r.code}
                  </option>
                ))}
              </select>

              {localSchedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="px-2 py-1 text-[11px] border border-gray-300 rounded text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Botón + siempre visible */}
      <button
        type="button"
        onClick={handleAddSchedule}
        className="w-full text-xs text-gray-600 hover:text-gray-800 flex items-center justify-center py-1"
      >
        <span className="inline-flex items-center gap-1">
          <span className="text-base leading-none">+</span>
          <span>Agregar otro horario</span>
        </span>
      </button>
    </div>
  );
};

export default SectionSchedulesFields;

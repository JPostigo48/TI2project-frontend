// components/student/LabGroupCard.jsx
import React, { useMemo } from 'react';
import { ACADEMIC_HOURS, DAYS } from '../../utils/constants';

// Helper local para normalizar IDs
const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return value._id.toString();
  return String(value);
};

const LabGroupCard = ({
  group,
  labEnrollmentStatus,   // 'not_started' | 'open' | 'processed'
  studentSchedule,
  preferences,            // array de IDs (string) de secciones en orden
  assignedLabSectionId,   // string o null
  onTogglePreference,     // (sectionId: string) => void
}) => {
  const isPhaseOpen = labEnrollmentStatus === 'open';
  const isPhaseProcessed = labEnrollmentStatus === 'processed';

  const groupId = normalizeId(group._id ?? group.id);
  const isAlreadyAssigned = Boolean(assignedLabSectionId);
  const isAssigned = isAlreadyAssigned && assignedLabSectionId === groupId;

  // ---- Conflictos de horario ----
  const hasScheduleConflict = useMemo(() => {
    if (!Array.isArray(studentSchedule) || !Array.isArray(group.schedule)) {
      return false;
    }

    for (const labSlot of group.schedule) {
      const labDay = labSlot.day;
      const labStart = labSlot.startHour;
      const labEnd = labSlot.startHour + (labSlot.duration || 1) - 1;

      for (const slot of studentSchedule) {
        if (slot.day !== labDay) continue;

        const sStart = slot.startHour;
        const sEnd = slot.startHour + (slot.duration || 1) - 1;

        const overlaps = !(labEnd < sStart || labStart > sEnd);
        if (overlaps) return true;
      }
    }

    return false;
  }, [group.schedule, studentSchedule]);

  // ---- Orden de preferencia ----
  const preferenceOrder = useMemo(() => {
    if (!Array.isArray(preferences) || !groupId) return null;
    const idx = preferences.indexOf(groupId);
    return idx === -1 ? null : idx + 1;
  }, [preferences, groupId]);

  const isSelected = preferenceOrder !== null;

  // ---- Bloqueos ----
  const isDisabled =
    !isPhaseOpen || hasScheduleConflict || isPhaseProcessed || isAlreadyAssigned;

  // ---- Renderizar horario ----
  const renderSchedule = () => {
    if (!Array.isArray(group.schedule) || !group.schedule.length)
      return 'Horario no definido';

    return group.schedule
      .map((s) => {
        const dayLabel = DAYS[s.day] || s.day;

        const startBlock = s.startHour;
        const endBlock = s.startHour + (s.duration || 1) - 1;

        const startTime = ACADEMIC_HOURS[startBlock]?.start;
        const endTime = ACADEMIC_HOURS[endBlock]?.end;

        let roomName = '';
        if (s.room && typeof s.room === 'object') {
          roomName = s.room.name || s.room.code || '';
        } else if (typeof s.room === 'string' && s.room.length < 10) {
          roomName = s.room;
        }

        return `${dayLabel} ${startTime} - ${endTime}${
          roomName ? ` (${roomName})` : ''
        }`;
      })
      .join(', ');
  };

  // ---- Clases de estilo ----
  const baseClasses =
    'text-left rounded-xl border p-4 transition-all relative';
  const stateClasses = isAssigned
    ? 'border-green-500 bg-green-50 ring-1 ring-green-500 shadow-md'
    : isSelected
    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md'
    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm';

  const disabledClasses = isDisabled ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      onClick={() => onTogglePreference(groupId)}
      disabled={isDisabled}
      className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
    >
      {/* Badge de orden (solo cuando se puede editar y está seleccionado) */}
      {isSelected && isPhaseOpen && !isAlreadyAssigned && (
        <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm z-10 border-2 border-white">
          {preferenceOrder}
        </div>
      )}

      {/* Badge de Asignado (preprocesado o post-proceso) */}
      {isAssigned && (
        <div className="absolute -top-3 -right-3 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm z-10 border-2 border-white">
          ✓
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-gray-800 text-lg">
          Grupo {group.group}
        </span>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
          Vacantes:{' '}
          {Math.max(
            0,
            (group.capacity || 0) - (group.enrolledCount || 0)
          )}{' '}
          / {group.capacity}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>{renderSchedule()}</p>
        {group.teacher && (
          <p className="text-xs text-gray-500">
            Docente:{' '}
            {typeof group.teacher === 'object'
              ? group.teacher.name
              : group.teacher}
          </p>
        )}

        {hasScheduleConflict && (
          <p className="text-[11px] text-red-600 mt-1">
            Este horario se cruza con una de tus clases de teoría.
          </p>
        )}
      </div>
    </button>
  );
};

export default LabGroupCard;

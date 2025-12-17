import React from 'react';
import { getMainBlockFromSection, getScheduleLabel, normalizeBlock } from '../../../utils/scheduleUtils';

const SectionScheduleDetails = ({ section, roomLabel }) => {
  const hasSchedule =
    Array.isArray(section.schedule) && section.schedule.length > 0;

  if (!hasSchedule) {
    return (
      <p className="text-[11px] text-gray-500">
        Esta sección no tiene horarios registrados.
      </p>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-700 mb-1">
        Horarios de la sección {section.group}
      </p>
      <ul className="space-y-1 text-[11px] text-gray-700">
        {section.schedule.map((block, idx) => {
          const normalized = normalizeBlock(block);
          const label = getScheduleLabel(normalized);

          const roomB =
            block.room?.name ||
            block.room?.code ||
            (typeof block.room === 'string' ? block.room : roomLabel || '');

          return (
            <li
              key={idx}
              className="flex flex-wrap gap-2 items-center"
            >
              <span>• {label}</span>
              {roomB && (
                <span className="text-gray-500">
                  — Aula: {roomB}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};


const SectionRow = ({
  section,
  isOpen,
  onToggle,
  onEdit,
}) => {
  const mainBlock = getMainBlockFromSection(section);
  const roomObj = mainBlock?.room;
  const roomLabel =
    roomObj?.name ||
    roomObj?.code ||
    (typeof roomObj === 'string' ? roomObj : 'Sin aula');

  // console.log("Dbg: ",mainBlock)

  return (
    <>
      <tr
        className={`cursor-pointer ${
          isOpen ? 'bg-indigo-50/40' : ''
        }`}
        onClick={() => onToggle(section._id)}
      >
        <td className="px-3 py-2 whitespace-nowrap font-medium">
          {section.group}
        </td>
        <td className="px-3 py-2 whitespace-nowrap capitalize">
          {section.type === 'lab' ? 'Laboratorio' : 'Teoría'}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          {section.capacity ?? 0}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          {section.enrolledCount ?? 0}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          {section.teacher?.name ||
            section.teacher?.fullName ||
            'Sin asignar'}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-right">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(section);
            }}
            className="text-xs text-indigo-600 hover:underline"
          >
            Editar
          </button>
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-3 py-2">
            <SectionScheduleDetails section={section} roomLabel={roomLabel} />
          </td>
        </tr>
      )}
    </>
  );
};

const SectionsTable = ({
  sections,
  openSectionId,
  onToggleSection,
  onEditSection,
}) => {
  if (sections.length === 0) {
    return (
      <p className="text-xs text-gray-500">
        Este curso no tiene grupos registrados en el semestre seleccionado.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Grupo
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Capacidad
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Matriculados
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Docente
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sections.map((section) => (
            <SectionRow
              key={section._id}
              section={section}
              isOpen={openSectionId === section._id}
              onToggle={onToggleSection}
              onEdit={onEditSection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default SectionsTable;

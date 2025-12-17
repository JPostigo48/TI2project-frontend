import React from 'react';
import { Calculator } from 'lucide-react';

const SectionSelectorCard = ({ schedule, selectedSectionId, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Registro de Notas</h1>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Selecciona Curso y Sección
          </label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 shadow-sm"
            value={selectedSectionId}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {schedule.map((sect) => (
              <option key={sect._id} value={sect._id}>
                {sect.course?.code} - {sect.course?.name}{' '}
                [{sect.type === 'theory' ? 'Teoría' : 'Lab'} - Grupo {sect.group}]
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SectionSelectorCard;

import React from 'react';
import StatusCard from '../common/StatusCard';

const LabEnrollmentControls = ({
  status,              // 'not_started' | 'open' | 'processed'
  onStart,
  onClose,
  onViewResults,
}) => {
  if (status === 'not_started') {
    return (
      <StatusCard status="idle" className="mt-2 flex justify-between gap-2">
        <p className="text-xs text-gray-700 mb-2">
          La matrícula de laboratorios aún no ha comenzado para este semestre.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="px-3 py-2 text-xs rounded bg-green-500 text-white hover:bg-green-700"
        >
          Iniciar matrícula de laboratorios
        </button>
      </StatusCard>
    );
  }

  if (status === 'open') {
    return (
      <StatusCard status="editing" className="mt-2 flex justify-between gap-2">
        <p className="text-xs text-gray-700 mb-2">
          La matrícula de laboratorios está <span className="font-semibold">abierta</span>.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 text-xs rounded bg-red-500 text-white hover:bg-red-700"
        >
          Cerrar y procesar matrículas
        </button>
      </StatusCard>
    );
  }

  // 'processed' u otros
  return (
    <StatusCard status="success" className="mt-2 flex justify-between gap-2">
      <p className="text-xs text-gray-700 mb-2">
        Las matrículas de laboratorios ya fueron procesadas para este semestre.
      </p>
      <button
        type="button"
        onClick={onViewResults}
        className="px-3 py-2 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        📄 Ver matrículas de laboratorios
      </button>
    </StatusCard>
  );
};

export default LabEnrollmentControls;

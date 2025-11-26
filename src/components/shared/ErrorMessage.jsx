import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Componente para mostrar mensajes de error de manera consistente.
 * Recibe un mensaje y lo muestra con iconografía y estilos de alerta.
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded flex items-start gap-2">
      <AlertCircle size={20} className="mt-1 shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;

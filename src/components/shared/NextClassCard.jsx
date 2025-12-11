import React, { useMemo, useState, useEffect } from 'react';
import { Clock, MapPin, Radio, Calendar, ArrowRight } from 'lucide-react';
import { getNextOrCurrentClass } from '../../utils/scheduleUtils';
import { DAYS } from '../../utils/constants';

const NextClassCard = ({ schedule = [] }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const result = useMemo(() => getNextOrCurrentClass(schedule), [schedule, /* tick implícito */]);

  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-full min-h-40">
        <div className="bg-gray-100 p-3 rounded-full mb-3">
          <Calendar className="text-gray-400" size={24} />
        </div>
        <h3 className="text-gray-600 font-medium">Sin clases próximas</h3>
        <p className="text-sm text-gray-400">No hay actividades programadas pronto.</p>
      </div>
    );
  }

  const { data, status, timeDisplay } = result;
  const isCurrent = status === 'CURRENT';

  return (
    <div className={`rounded-xl shadow-md p-6 relative overflow-hidden transition-all h-full
      ${isCurrent 
        ? 'bg-linear-to-br from-blue-600 to-blue-800 text-white border-none' 
        : 'bg-white border-l-4 border-blue-500'
      }`}
    >
      {/* Badge de Estado */}
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-2
          ${isCurrent ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-blue-50 text-blue-700'}`}>
          {isCurrent ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              EN CURSO
            </>
          ) : (
            <>
              <Clock size={14} />
              PRÓXIMA CLASE
            </>
          )}
        </div>
        
        {/* Día */}
        <div className={`text-sm font-medium ${isCurrent ? 'text-blue-100' : 'text-gray-500'}`}>
          {DAYS[data.day] || data.day}
        </div>
      </div>

      {/* Info Principal */}
      <div>
        <h3 className={`text-xl font-bold leading-tight mb-1 ${isCurrent ? 'text-white' : 'text-gray-800'}`}>
          {data.courseName}
        </h3>
        <p className={`text-sm ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}>
          {data.code} • Grupo {data.group}
        </p>
      </div>

      {/* Footer: Hora y Aula */}
      <div className={`mt-6 pt-4 border-t flex justify-between items-center
        ${isCurrent ? 'border-white/20' : 'border-gray-100'}`}>
        
        <div className="flex items-center gap-2">
          <Clock size={18} className={isCurrent ? 'text-blue-200' : 'text-gray-400'} />
          <span className={`text-lg font-mono font-semibold ${isCurrent ? 'text-white' : 'text-gray-700'}`}>
            {timeDisplay}
          </span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
          ${isCurrent ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
          <MapPin size={16} />
          {data.room?.code || data.room?.name || 'Aula ?'}
        </div>
      </div>
      
      {/* Decoración de fondo para estado activo */}
      {isCurrent && (
        <Radio className="absolute -bottom-6 -right-6 text-white/10 w-32 h-32" />
      )}
    </div>
  );
};

export default NextClassCard;
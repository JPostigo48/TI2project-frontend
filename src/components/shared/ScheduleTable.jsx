import React from 'react';
import { DAYS, ACADEMIC_HOURS } from '../../utils/constants';

export default function ScheduleTable({ blocks = [] }) {
  const dayKeys = Object.keys(DAYS);
  const hourKeys = Object.keys(ACADEMIC_HOURS).map(Number).sort((a, b) => a - b);

  const table = {};
  hourKeys.forEach(hour => {
    table[hour] = {
      Monday: null, Tuesday: null, Wednesday: null, Thursday: null, 
      Friday: null, Saturday: null, Sunday: null
    };
  });

  blocks.forEach((block) => {
    if (!block || !block.day || !dayKeys.includes(block.day)) return;

    const startHour = Number(block.startHour);
    const duration = Number(block.duration) || 1;

    if (!Number.isFinite(startHour)) return;

    for (let k = 0; k < duration; k += 1) {
      const currentHour = startHour + k;
      
      if (table[currentHour]) {
        table[currentHour][block.day] = block;
      }
    }
  });

  const getRoomName = (roomData) => {
    if (!roomData) return null;
    if (typeof roomData === 'object') return roomData.name || roomData.code;
    if (typeof roomData === 'string' && roomData.length < 10) return roomData;
    return null;
  };

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-center text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-200 text-gray-800 font-semibold">
            <th className="border p-2 w-32">Hora</th>
            {dayKeys.map((eng) => (
              <th key={eng} className="border p-2 min-w-[140px]">
                {DAYS[eng]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hourKeys.map((hour) => {
            const timeInfo = ACADEMIC_HOURS[hour];
            const timeLabel = `${timeInfo.start} - ${timeInfo.end}`;
            
            return (
              <tr key={hour} className="hover:bg-gray-100 transition-colors">
                {/* Columna de Hora (Izquierda) */}
                <td className="border p-2 font-medium bg-gray-100 text-xs">
                    <div className="font-bold text-gray-600">{hour}° Hora</div>
                    <div className="text-gray-500">{timeLabel}</div>
                </td>

                {/* Columnas de Días */}
                {dayKeys.map((day) => {
                  const block = table[hour][day];

                  const title = block ? (block.courseName || block.course || 'Clase') : null;
                  const group = block?.group ? `Grupo ${block.group}` : null;
                  const section = block?.section ? `Secc. ${block.section}` : null;
                  const room = getRoomName(block?.room);
                  const teacher = block?.teacher?.name || (typeof block?.teacher === 'string' ? block.teacher : null);
                  return (
                    <td key={day} className="border p-1 align-middle h-16">
                      {block ? (
                        <div className={`rounded p-1 border flex flex-col items-center justify-center h-full w-full shadow-sm
                            ${block.type === 'lab' 
                                ? 'bg-purple-50 border-purple-200 text-purple-900' 
                                : 'bg-blue-50 border-blue-200 text-blue-900'
                            }
                        `}>
                          <div className="font-bold text-[13px] leading-tight">
                            {title}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 justify-center mt-1">
                             {(group || section) && (
                                <span className="text-[10px] bg-white/60 px-1.5 rounded font-semibold">
                                    {group || section}
                                </span>
                             )}
                             {room && (
                                <span className="text-[10px] bg-white/60 px-1.5 rounded font-semibold">
                                    {room}
                                </span>
                             )}
                          </div>

                          {teacher && (
                            <div className="text-[10px] opacity-80 mt-0.5 truncate max-w-[120px]">
                                {teacher}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full min-h-[50px]" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
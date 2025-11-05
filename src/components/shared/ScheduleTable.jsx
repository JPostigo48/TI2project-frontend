// src/components/shared/ScheduleTable.jsx
import React from 'react';
import { DAYS } from '../../utils/constants';

// Bloques de tiempo oficiales de la universidad
const TIME_SLOTS = [
  '07:00-07:50', '07:50-08:40', '08:50-09:40', '09:40-10:30',
  '10:40-11:30', '11:30-12:20', '12:20-13:10', '13:10-14:00',
  '14:00-14:50', '14:50-15:40', '15:50-16:40', '16:40-17:30',
  '17:30-18:30', '18:30-19:20',
];

const toMinutes = (hhmm) => {
  const [hh, mm] = String(hhmm).split(':');
  return parseInt(hh || '0', 10) * 60 + parseInt(mm || '0', 10);
};

function getSlotIndices(start, end) {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const indices = [];
  TIME_SLOTS.forEach((slot, idx) => {
    const [s, e] = slot.split('-');
    const sMin = toMinutes(s);
    const eMin = toMinutes(e);
    if (startMin < eMin && endMin > sMin) indices.push(idx);
  });
  return indices;
}

export default function ScheduleTable({ blocks = [] }) {
  const dayKeys = Object.keys(DAYS);

  const emptyRow = () => ({
    Monday: null, Tuesday: null, Wednesday: null,
    Thursday: null, Friday: null, Saturday: null, Sunday: null,
  });
  const table = TIME_SLOTS.map(() => emptyRow());

  blocks.forEach((block) => {
    if (!block || !block.day || !dayKeys.includes(block.day)) return;
    const idxs = getSlotIndices(block.startTime, block.endTime);
    idxs.forEach((i) => {
      if (i >= 0 && i < TIME_SLOTS.length) {
        table[i][block.day] = block;
      }
    });
  });

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-center text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-200 text-gray-800 font-semibold">
            <th className="border p-2">Hora</th>
            {dayKeys.map((eng) => (
              <th key={eng} className="border p-2">
                {DAYS[eng]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((slot, i) => (
            <tr key={slot} className="hover:bg-gray-100 transition-colors">
              <td className="border p-2 font-medium bg-gray-100">{slot}</td>
              {dayKeys.map((day) => {
                const block = table[i][day];
                const title = block?.courseName || block?.course || 'Clase';
                const section = block?.section ? `Secc. ${block.section}` : null;
                const room = block?.room || null;
                const teacher = block?.teacher || null;

                return (
                  <td key={day} className="border p-1 align-middle">
                    {block ? (
                      <div className="bg-blue-50 rounded p-1 border border-blue-200 flex flex-col items-center justify-center h-full">
                        <div className="font-semibold text-[15px] text-gray-800">{title}</div>
                        {(section || room) && (
                          <div className="text-[12px] text-gray-700">
                            {[section, room].filter(Boolean).join(' • ')}
                          </div>
                        )}
                        {teacher && (
                          <div className="text-[12px] text-gray-600">{teacher}</div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full py-4"></div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

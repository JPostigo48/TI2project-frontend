import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

import TeacherService from '../../services/teacher.service';
import ScheduleTable from '../../components/shared/ScheduleTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const TeacherSchedule = () => {
  const { data: sections = [], isLoading, error } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  const scheduleBlocks = useMemo(() => {
    if (!Array.isArray(sections)) return [];
    const blocks = [];

    sections.forEach((section) => {
      // Validación defensiva: si la sección es nula, la saltamos
      if (!section) return;

      if (Array.isArray(section.schedule)) {
        section.schedule.forEach((slot) => {
          if (!slot) return;

          // Determinamos el tipo para el color (Backend debe mandar 'reservation' o 'theory'/'lab')
          const sectionType = section.type || 'theory';

          blocks.push({
            day: slot.day,
            startHour: slot.startHour,
            duration: slot.duration,
            room: slot.room, 
            courseName: section.course?.name || section.course?.reason || section.group || 'Actividad',
            code: section.course?.code || '',
            group: section.group || '',
            type: sectionType, 
            teacher: section.teacher?.name || '', 
          });
        });
      }
    });
    return blocks;
  }, [sections]);

  if (isLoading) return <LoadingSpinner message="Cargando tu carga académica..." />;
  if (error) return <ErrorMessage message="Error al cargar el horario." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
           <Calendar size={24} />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Mi Horario de Dictado</h1>
           <p className="text-sm text-gray-500">Semestre 2025-B</p>
        </div>
      </div>

      {scheduleBlocks.length === 0 ? (
         <div className="card text-center py-12 text-gray-500 bg-gray-50 border-dashed flex flex-col items-center">
            <Clock className="mb-2 opacity-30" size={48}/>
            <p>No tienes carga académica registrada.</p>
            <p className="text-xs mt-1 opacity-70">(O tus reservas ya pasaron de fecha)</p>
         </div>
      ) : (
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <ScheduleTable blocks={scheduleBlocks} />
            
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 justify-end">
               <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></span> Teoría
               </div>
               <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-purple-50 border border-purple-200 rounded"></span> Laboratorio
               </div>
               <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></span> Reserva
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default TeacherSchedule;
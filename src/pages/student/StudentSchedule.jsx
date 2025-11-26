// src/pages/student/StudentSchedule.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import ScheduleTable from '../../components/shared/ScheduleTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const StudentSchedule = () => {
  const { data: blocks = [], isLoading, error } = useQuery({
    queryKey: ['studentSchedule'],
    queryFn: () => StudentService.getSchedule(),
    select: (res) => Array.isArray(res) ? res : (res?.scheduleBlocks ?? []),
  });

  // console.log(blocks)

  if (isLoading) return <LoadingSpinner message="Cargando horario..." />;
  if (error) return <ErrorMessage message="Error al cargar horario" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-semibold mb-2">Mi Horario</h1>
      {blocks.length === 0 ? (
        <div className="card">No tienes clases programadas esta semana.</div>
      ) : (
        <ScheduleTable blocks={blocks} />
      )}
    </div>
  );
};

export default StudentSchedule;

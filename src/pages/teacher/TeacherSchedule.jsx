// src/pages/teacher/TeacherSchedule.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import ScheduleTable from '../../components/shared/ScheduleTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const TeacherSchedule = () => {
  const { data: blocks, isLoading, error } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  if (isLoading) return <LoadingSpinner message="Cargando horario..." />;
  if (error) return <ErrorMessage message="Error al cargar horario" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-semibold mb-2">Mi Horario</h1>
      <ScheduleTable blocks={blocks} />
    </div>
  );
};

export default TeacherSchedule;

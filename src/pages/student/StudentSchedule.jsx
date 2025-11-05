import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { DAYS } from '../../utils/constants';

const StudentSchedule = () => {
  const { data: schedule, isLoading, error } = useQuery({
    queryKey: ['student-schedule'],
    queryFn: () => StudentService.getSchedule(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando horario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <p className="text-red-700">Error al cargar el horario: {error.message}</p>
      </div>
    );
  }

  // Agrupar por día
  const scheduleByDay = {};
  const daysOrder = Object.values(DAYS);
  daysOrder.forEach(day => {
    scheduleByDay[day] = schedule?.filter(item => item.day === day) || [];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mi Horario</h1>
          <p className="text-gray-600 mt-1">Horario del semestre 2024-1</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <Calendar size={20} />
          <span className="font-semibold">Semana Actual</span>
        </div>
      </div>

      <div className="space-y-4">
        {daysOrder.map(day => {
          const dayClasses = scheduleByDay[day];
          if (dayClasses.length === 0) return null;
          return (
            <div key={day} className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                {day}
              </h3>
              <div className="space-y-3">
                {dayClasses.map(classItem => (
                  <div
                    key={classItem.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {classItem.courseName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {classItem.courseCode} - Sección {classItem.section}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock size={16} />
                          <span>{classItem.startTime} - {classItem.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin size={16} />
                          <span>{classItem.room}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <User size={16} />
                          <span>{classItem.teacher}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        2 horas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total de Clases</p>
          <p className="text-3xl font-bold text-blue-700">{schedule?.length || 0}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-green-600 mb-1">Horas Semanales</p>
          <p className="text-3xl font-bold text-green-700">
            {schedule?.length ? schedule.length * 2 : 0}h
          </p>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Cursos</p>
          <p className="text-3xl font-bold text-purple-700">
            {schedule ? new Set(schedule.map(c => c.courseCode)).size : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;

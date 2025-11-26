import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import {
  FlaskConical,
  Info,
  Clock3,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { ACADEMIC_HOURS, DAYS } from '../../utils/constants';

const StudentLabs = () => {
  const queryClient = useQueryClient(); 
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [preferences, setPreferences] = useState([]); 
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  const {
    data: labGroups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['studentLabs'],
    queryFn: () => StudentService.getAvailableLabs(),
  });

  const { 
    data: enrollmentData, 
    isLoading: isLoadingEnrollment 
  } = useQuery({
    queryKey: ['courseEnrollment', selectedCourseId],
    queryFn: () => StudentService.getEnrollment(selectedCourseId),
    enabled: !!selectedCourseId, 
  });

  const courses = useMemo(() => {
    const map = new Map();
    labGroups.forEach((g) => {
      if (!g) return;
      const courseObj = g.course || {};
      const courseId = courseObj._id || g.courseId || g.course;
      if (!courseId) return;

      const existing = map.get(courseId);
      if (!existing) {
        map.set(courseId, {
          courseId,
          semesterId: g.semester || g.semesterId || null,
          courseCode: courseObj.code || g.courseCode || '',
          courseName: courseObj.name || g.courseName || 'Curso sin nombre',
          groups: [g],
        });
      } else {
        existing.groups.push(g);
      }
    });
    return Array.from(map.values());
  }, [labGroups]);

  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].courseId);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (enrollmentData && enrollmentData.labPreferences && enrollmentData.labPreferences.length > 0) {
      setPreferences(enrollmentData.labPreferences);
    } else if (enrollmentData) {
      setPreferences([]);
    }
  }, [enrollmentData]);

  useEffect(() => {
    setSuccessMessage('');
    setLocalError('');
  }, [selectedCourseId]);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.courseId === selectedCourseId),
    [courses, selectedCourseId]
  );

  const togglePreference = (sectionId) => {
    setLocalError('');
    setSuccessMessage('');
    setPreferences((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId);
      }
      return [...prev, sectionId];
    });
  };

  const getPreferenceOrder = (sectionId) => {
    const idx = preferences.indexOf(sectionId);
    return idx === -1 ? null : idx + 1;
  };

  const mutation = useMutation({
    mutationFn: (payload) => StudentService.enrollLab(payload),
    onSuccess: () => {
      setSuccessMessage('Preferencias guardadas correctamente.');
      setLocalError('');
      queryClient.invalidateQueries(['courseEnrollment', selectedCourseId]);
    },
    onError: (err) => {
      setSuccessMessage('');
      setLocalError(
        err?.response?.data?.message || err?.message || 'Error al guardar.'
      );
    },
  });

  const handleSubmit = () => {
    if (!selectedCourse || !selectedCourse.semesterId) {
      setLocalError('Error de datos del curso.');
      return;
    }
    if (!preferences.length) {
      setLocalError('Debes seleccionar al menos un grupo.');
      return;
    }

    mutation.mutate({
      courseId: selectedCourse.courseId,
      semesterId: selectedCourse.semesterId,
      preferences,
    });
  };

  const renderSchedule = (group) => {
    if (!Array.isArray(group.schedule) || !group.schedule.length) return 'Horario no definido';

    return group.schedule.map((s) => {
      const dayLabel = DAYS[s.day] || s.day; 
      
      const startBlock = s.startHour; 
      const endBlock = s.startHour + (s.duration || 1) - 1; 
      
      const startTime = ACADEMIC_HOURS[startBlock]?.start;
      const endTime = ACADEMIC_HOURS[endBlock]?.end;

      let roomName = '';
      if (s.room && typeof s.room === 'object') {
        roomName = s.room.name || s.room.code || '';
      } else if (typeof s.room === 'string' && s.room.length < 10) {
        roomName = s.room;
      }

      return `${dayLabel} ${startTime} - ${endTime}${roomName ? ` (${roomName})` : ''}`;
    }).join(', ');
  };

  if (isLoading) return <LoadingSpinner message="Cargando laboratorios..." />;
  if (error) return <ErrorMessage message="Error al cargar laboratorios." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <FlaskConical className="text-blue-600" />
        <h1 className="text-xl font-semibold">Matrícula de Laboratorios</h1>
      </div>

      <div className="card bg-blue-50 border border-blue-200 flex gap-3 items-start">
        <Info className="text-blue-600 mt-1 shrink-0" size={18} />
        <div className="text-sm text-gray-700">
          <p>Selecciona los grupos en orden de prioridad (1 = Mayor prioridad).</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          No tienes cursos con laboratorios disponibles.
        </div>
      ) : (
        <>
          {/* Selector */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <Clock3 className="text-gray-600" size={18} />
              <label className="text-sm font-semibold text-gray-800">Selecciona un curso:</label>
            </div>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full max-w-md bg-white"
            >
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Grupos */}
          {selectedCourse && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  Grupos de {selectedCourse.courseName}
                </h2>
                {isLoadingEnrollment && <span className="text-xs text-blue-600">Cargando tus preferencias...</span>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {selectedCourse.groups.map((group) => {
                  const order = getPreferenceOrder(group._id);
                  const isSelected = order !== null;
                  
                  return (
                    <button
                      key={group._id}
                      type="button"
                      onClick={() => togglePreference(group._id)}
                      className={`text-left rounded-xl border p-4 transition-all relative ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Badge de Orden */}
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm z-10 border-2 border-white">
                          {order}
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-800 text-lg">Grupo {group.group}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
                           Vacantes: {Math.max(0, (group.capacity || 0) - (group.enrolledCount || 0))} / {group.capacity}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{renderSchedule(group)}</p>
                        {group.teacher && (
                           <p className="text-xs text-gray-500">
                             Docente: {typeof group.teacher === 'object' ? group.teacher.name : group.teacher}
                           </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback y Botón */}
          {(localError || successMessage) && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${localError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
               {localError ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
               {localError || successMessage}
            </div>
          )}

          {selectedCourse && (
            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={mutation.isLoading || preferences.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors ${
                  preferences.length === 0 || mutation.isLoading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {mutation.isLoading ? 'Guardando...' : 'Guardar Orden de Preferencia'}
                {!mutation.isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentLabs;
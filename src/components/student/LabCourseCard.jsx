// components/student/LabCourseCard.jsx
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../shared/layout/LoadingSpinner';
import ErrorMessage from '../shared/layout/ErrorMessage';
import LabGroupCard from './LabGroupCard';

// Helper local para normalizar IDs
const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return value._id.toString();
  return String(value);
};

const LabCourseCard = ({ course, labEnrollmentStatus, studentSchedule }) => {
  const queryClient = useQueryClient();

  const [preferences, setPreferences] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  const isPhaseNotStarted = labEnrollmentStatus === 'not_started';
  const isPhaseOpen = labEnrollmentStatus === 'open';
  const isPhaseProcessed = labEnrollmentStatus === 'processed';

  // ====== Datos de matrícula de este curso ======
  const {
    data: enrollmentData,
    isLoading: isLoadingEnrollment,
    error: enrollmentError,
  } = useQuery({
    queryKey: ['courseEnrollment', course.courseId],
    queryFn: () => StudentService.getEnrollment(course.courseId),
    enabled: !!course.courseId,
  });

  // Cargar preferencias iniciales (normalizadas)
  useEffect(() => {
    if (enrollmentData && Array.isArray(enrollmentData.labPreferences)) {
      const normalizedPrefs = enrollmentData.labPreferences
        .map((p) => normalizeId(p))
        .filter(Boolean);

      setPreferences(normalizedPrefs);
    } else if (enrollmentData) {
      setPreferences([]);
    }
  }, [enrollmentData]);

  // Reset feedback al cambiar de curso
  useEffect(() => {
    setSuccessMessage('');
    setLocalError('');
  }, [course.courseId]);

  // ID del lab asignado (preprocesado o procesado), normalizado
  const assignedLabSectionId = normalizeId(
    enrollmentData?.assignedLabSectionId ?? enrollmentData?.assignedLabSection
  );

  const isAlreadyAssigned = Boolean(assignedLabSectionId);

  // ========= Toggle de preferencias =========
  const togglePreference = (sectionId) => {
    // Si ya tiene un lab asignado (por preproceso o proceso final),
    // no puede modificar prioridades en este curso.
    if (!isPhaseOpen || isAlreadyAssigned) return;

    const normalizedId = normalizeId(sectionId);

    setLocalError('');
    setSuccessMessage('');
    setPreferences((prev) => {
      if (prev.includes(normalizedId)) {
        return prev.filter((id) => id !== normalizedId);
      }
      return [...prev, normalizedId];
    });
  };

  const mutation = useMutation({
    mutationFn: (payload) => StudentService.enrollLab(payload),
    onSuccess: () => {
      setSuccessMessage('Preferencias guardadas correctamente.');
      setLocalError('');
      queryClient.invalidateQueries(['courseEnrollment', course.courseId]);
    },
    onError: (err) => {
      setSuccessMessage('');
      setLocalError(
        err?.response?.data?.message || err?.message || 'Error al guardar.'
      );
    },
  });

  const handleSubmit = () => {
    if (!course || !course.semesterId) {
      setLocalError('Error de datos del curso.');
      return;
    }
    if (!preferences.length) {
      setLocalError('Debes seleccionar al menos un grupo.');
      return;
    }

    mutation.mutate({
      courseId: course.courseId,
      semesterId: course.semesterId,
      preferences,
    });
  };

  if (isLoadingEnrollment) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">
            {course.courseName}
          </h2>
          <span className="text-xs text-gray-500">Cargando datos...</span>
        </div>
        <LoadingSpinner message="" />
      </div>
    );
  }

  if (enrollmentError) {
    return (
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          {course.courseName}
        </h2>
        <ErrorMessage message="Error al cargar tu información de laboratorio para este curso." />
      </div>
    );
  }

  const showSaveButton = isPhaseOpen && !isAlreadyAssigned;

  return (
    <div className="card space-y-3">
      {/* Header del curso */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            {course.courseCode && (
              <span className="text-gray-500 mr-1">
                {course.courseCode} –{' '}
              </span>
            )}
            {course.courseName}
          </h2>

          {/* Mensaje según estado de asignación */}
          {isAlreadyAssigned && (
            <p className="text-xs text-green-700 mt-1">
              Ya tienes un laboratorio asignado para este curso.{' '}
              <span className="font-semibold">Busca la tarjeta en verde.</span>
            </p>
          )}

          {!isAlreadyAssigned && isPhaseProcessed && (
            <p className="text-xs text-green-700 mt-1">
              Grupo asignado:{' '}
              <span className="font-semibold">ver marcado en verde</span>
            </p>
          )}

          {isPhaseNotStarted && (
            <p className="text-xs text-gray-500 mt-1">
              La matrícula de laboratorios aún no está habilitada.
            </p>
          )}
        </div>
      </div>

      {/* Lista de grupos */}
      <div className="grid md:grid-cols-2 gap-4">
        {course.groups.map((group) => (
          <LabGroupCard
            key={group._id}
            group={group}
            labEnrollmentStatus={labEnrollmentStatus}
            studentSchedule={studentSchedule}
            preferences={preferences}
            assignedLabSectionId={assignedLabSectionId}
            onTogglePreference={togglePreference}
          />
        ))}
      </div>

      {/* Feedback local de este curso */}
      {(localError || successMessage) && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
            localError
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {localError ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {localError || successMessage}
        </div>
      )}

      {/* Botón guardar (por curso) */}
      {showSaveButton && (
        <div className="flex justify-end pt-2 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isLoading || preferences.length === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors ${
              preferences.length === 0 || mutation.isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {mutation.isLoading ? 'Guardando...' : 'Guardar preferencias'}
            {!mutation.isLoading && <ArrowRight size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default LabCourseCard;

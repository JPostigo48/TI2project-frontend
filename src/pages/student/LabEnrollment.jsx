// src/pages/student/LabEnrollment.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const LabEnrollment = () => {
  const qc = useQueryClient();
  const { data: labs, isLoading, error } = useQuery({
    queryKey: ['availableLabs'],
    queryFn: () => StudentService.getAvailableLabs(),
  });

  // Mutación de ejemplo: simula inscripción (podrías llamarla a tu API real)
  const enroll = useMutation({
    mutationFn: async (labId) => {
      // en mocks no realizamos ninguna acción real
      return labId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['availableLabs'] }),
  });

  if (isLoading) return <LoadingSpinner message="Cargando laboratorios..." />;
  if (error) return <ErrorMessage message="Error al cargar laboratorios" />;
  if (!labs.length) return <p>No hay laboratorios disponibles.</p>;

  // Agrupar por curso
  const grouped = labs.reduce((acc, lab) => {
    if (!acc[lab.courseCode]) acc[lab.courseCode] = [];
    acc[lab.courseCode].push(lab);
    return acc;
  }, {});

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-semibold">Inscripción a Laboratorios</h1>
      {Object.entries(grouped).map(([courseCode, groupLabs]) => (
        <div key={courseCode} className="card">
          <h2 className="font-semibold mb-2">Curso {courseCode}</h2>
          <ul className="space-y-2">
            {groupLabs.map((lab) => (
              <li key={lab.id} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <div className="font-medium">{lab.group} ({lab.day} {lab.startTime}-{lab.endTime})</div>
                  <div className="text-sm text-gray-600">Cupos: {lab.enrolled}/{lab.capacity}</div>
                </div>
                <button
                  onClick={() => enroll.mutate(lab.id)}
                  disabled={lab.enrolled >= lab.capacity || enroll.isPending}
                  className="btn-primary"
                >
                  {enroll.isPending ? 'Procesando...' : 'Inscribirme'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LabEnrollment;

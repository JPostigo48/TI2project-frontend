import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StudentService from '../../services/student.service';
import ErrorMessage from '../../components/shared/ErrorMessage';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const LabEnrollment = () => {
  const queryClient = useQueryClient();
  const [selectedLab, setSelectedLab] = useState(null);

  const {
    data: labs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['student-labs'],
    queryFn: () => StudentService.getLabs(),
  });

  const enrollMutation = useMutation({
    mutationFn: (labId) => StudentService.enrollLab(labId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-labs'] });
    },
  });

  const handleEnroll = (labId) => {
    setSelectedLab(labId);
    enrollMutation.mutate(labId);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando laboratorios..." />;
  }
  if (error) {
    return <ErrorMessage message={error.message || 'Error al cargar los laboratorios'} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Inscripción a Laboratorios</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {labs.map((lab) => (
          <div key={lab.id} className="border p-4 rounded-lg bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-1">{lab.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {lab.day} {lab.time}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Cupos: {lab.enrolled}/{lab.capacity}
            </p>
            <button
              onClick={() => handleEnroll(lab.id)}
              disabled={enrollMutation.isLoading && selectedLab === lab.id}
              className="mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {enrollMutation.isLoading && selectedLab === lab.id ? 'Inscribiendo...' : 'Inscribirse'}
            </button>
            {enrollMutation.isSuccess && selectedLab === lab.id && (
              <p className="text-green-600 text-sm mt-2">
                {enrollMutation.data?.message || 'Inscripción exitosa'}
              </p>
            )}
            {enrollMutation.isError && selectedLab === lab.id && (
              <p className="text-red-600 text-sm mt-2">
                {enrollMutation.error?.message || 'Error al inscribirse'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabEnrollment;

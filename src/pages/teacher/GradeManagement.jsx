import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calculator, Users } from 'lucide-react';

import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';

import SectionSelectorCard from '../../components/teacher/SectionSelectorCard';
import GradesTable from '../../components/teacher/GradesTable';

const deepClone = (obj) => {
  // structuredClone es lo ideal si está disponible
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
};

const normStudent = (s) => ({
  ...s,
  partials: {
    P1: { continuous: s.partials?.P1?.continuous ?? null, exam: s.partials?.P1?.exam ?? null },
    P2: { continuous: s.partials?.P2?.continuous ?? null, exam: s.partials?.P2?.exam ?? null },
    P3: { continuous: s.partials?.P3?.continuous ?? null, exam: s.partials?.P3?.exam ?? null },
  },
  substitutive: s.substitutive ?? null,
});

const sameNum = (a, b) => {
  const na = a === null || a === undefined ? null : Number(a);
  const nb = b === null || b === undefined ? null : Number(b);
  return na === nb;
};

const GradeManagement = () => {
  const qc = useQueryClient();

  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [localGrades, setLocalGrades] = useState([]);

  // Cargar cursos del docente
  const { data: schedule = [], isLoading: loadingSchedule } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  const currentSection = useMemo(
    () => schedule.find((s) => s._id === selectedSectionId),
    [schedule, selectedSectionId]
  );

  // Cargar resumen de notas
  const {
    data: remoteGradesRaw,
    isLoading: loadingGrades,
    error: errorGrades,
  } = useQuery({
    queryKey: ['grades', currentSection?._id],
    queryFn: async () => {
      if (!currentSection?._id) return [];
      const res = await TeacherService.getGradesSummary(currentSection._id);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!currentSection?._id,
  });

  const remoteGrades = useMemo(
    () => (remoteGradesRaw || []).map(normStudent),
    [remoteGradesRaw]
  );

  useEffect(() => {
    setLocalGrades(deepClone(remoteGrades));
    setIsEditing(false);
  }, [remoteGradesRaw]); // cuando llega data nueva desde server, resetea bien

  // ✅ NUEVAS MUTACIONES: por parcial (no por campo)
  const mutationPartial = useMutation({ mutationFn: TeacherService.setPartialGrades });
  const mutationSub = useMutation({ mutationFn: TeacherService.setSubstitutive });

  const saving = mutationPartial.isLoading || mutationSub.isLoading;

  const onChangePartial = (idx, partialKey, field, value) => {
    setLocalGrades((prev) => {
      const updated = deepClone(prev);
      if (!updated[idx].partials) updated[idx].partials = {};
      if (!updated[idx].partials[partialKey]) updated[idx].partials[partialKey] = { continuous: null, exam: null };
      updated[idx].partials[partialKey][field] = value; // value ya viene clamp o null
      return updated;
    });
  };

  const onChangeSub = (idx, value) => {
    setLocalGrades((prev) => {
      const updated = deepClone(prev);
      updated[idx].substitutive = value;
      return updated;
    });
  };

  const handleSave = async () => {
    if (!currentSection?._id) return;

    // Mapa remote por studentId para comparar
    const remoteMap = new Map(remoteGrades.map((r) => [r.studentId, r]));

    const promises = [];

    for (const local of localGrades) {
      const remote = remoteMap.get(local.studentId);
      if (!remote) continue;

      // ✅ Guardar por PARCIAL COMPLETO si cambió continuous o exam
      for (const pKey of ['P1', 'P2', 'P3']) {
        const lP = local.partials?.[pKey] || { continuous: null, exam: null };
        const rP = remote.partials?.[pKey] || { continuous: null, exam: null };

        const changed =
          !sameNum(lP.continuous, rP.continuous) || !sameNum(lP.exam, rP.exam);

        if (changed) {
          promises.push(
            mutationPartial.mutateAsync({
              section: currentSection._id,
              studentId: local.studentId,
              partial: pKey,
              continuous: lP.continuous ?? null,
              exam: lP.exam ?? null,
            })
          );
        }
      }

      // Sustitutivo
      if (!sameNum(local.substitutive, remote.substitutive)) {
        promises.push(
          mutationSub.mutateAsync({
            section: currentSection._id,
            studentId: local.studentId,
            value: local.substitutive ?? null,
          })
        );
      }
    }

    await Promise.all(promises);

    await qc.invalidateQueries(['grades', currentSection._id]);
    setIsEditing(false);
  };

  if (loadingSchedule) return <LoadingSpinner message="Cargando cursos..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionSelectorCard
        schedule={schedule}
        selectedSectionId={selectedSectionId}
        onChange={(id) => setSelectedSectionId(id)}
      />

      {!selectedSectionId ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calculator size={32} className="opacity-30" />
          </div>
          <p className="text-lg">Selecciona una asignatura arriba para comenzar.</p>
        </div>
      ) : loadingGrades ? (
        <LoadingSpinner message="Obteniendo acta de notas..." />
      ) : errorGrades ? (
        <ErrorMessage message="Error al cargar las notas." />
      ) : localGrades.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center text-yellow-800">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Users size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold mb-1">Sin alumnos matriculados</h3>
          <p className="text-sm">Esta sección no tiene estudiantes inscritos todavía.</p>
        </div>
      ) : (
        <GradesTable
          currentSection={currentSection}
          localGrades={localGrades}
          isEditing={isEditing}
          saving={saving}
          onEnableEdit={() => setIsEditing(true)}
          onCancelEdit={() => {
            setLocalGrades(deepClone(remoteGrades));
            setIsEditing(false);
          }}
          onSave={handleSave}
          onChangePartial={onChangePartial}
          onChangeSub={onChangeSub}
        />
      )}
    </div>
  );
};

export default GradeManagement;

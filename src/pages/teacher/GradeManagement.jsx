import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, X, Edit3, Calculator, AlertCircle, Users } from 'lucide-react';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const GradeManagement = () => {
  const qc = useQueryClient();
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [localGrades, setLocalGrades] = useState([]);

  // Cargar cursos
  const { data: schedule = [], isLoading: loadingSchedule } = useQuery({
    queryKey: ['teacherSchedule'],
    queryFn: () => TeacherService.getSchedule(),
  });

  const currentSection = useMemo(() => 
    schedule.find(s => s._id === selectedSectionId), 
    [schedule, selectedSectionId]
  );

  // Cargar notas
  const { 
    data: remoteGrades, 
    isLoading: loadingGrades, 
    error: errorGrades 
  } = useQuery({
    queryKey: ['grades', currentSection?._id],
    queryFn: () => {
        if (!currentSection?._id) return [];
        return TeacherService.getGradesSummary(currentSection._id);
    },
    enabled: !!currentSection?._id,
  });

  useEffect(() => {
    if (remoteGrades) {
      setLocalGrades(JSON.parse(JSON.stringify(remoteGrades)));
      setIsEditing(false);
    }
  }, [remoteGrades]);

  const mutationGrade = useMutation({ mutationFn: TeacherService.setGrade });
  const mutationSub = useMutation({ mutationFn: TeacherService.setSubstitutive });

  // --- LOGICA DE INPUTS ---
  const updateLocalValue = (idx, partialKey, field, value) => {
    const updated = [...localGrades];
    let cleanValue = value;
    if (value !== '') {
        const num = parseFloat(value);
        if (num < 0) cleanValue = 0;
        if (num > 20) cleanValue = 20;
    }
    if (!updated[idx].partials[partialKey]) {
      updated[idx].partials[partialKey] = { continuous: null, exam: null };
    }
    updated[idx].partials[partialKey][field] = cleanValue === '' ? null : Number(cleanValue);
    setLocalGrades(updated);
  };

  const updateSubstitutive = (idx, value) => {
    const updated = [...localGrades];
    let cleanValue = value;
    if (value !== '') {
        const num = parseFloat(value);
        if (num < 0) cleanValue = 0;
        if (num > 20) cleanValue = 20;
    }
    updated[idx].substitutive = cleanValue === '' ? null : Number(cleanValue);
    setLocalGrades(updated);
  };

  const handleSave = async () => {
    if (!currentSection) return;
    const promises = [];

    for (let i = 0; i < localGrades.length; i++) {
      const local = localGrades[i];
      const remote = remoteGrades.find(r => r.studentId === local.studentId);
      if (!remote) continue;

      ['P1', 'P2', 'P3'].forEach(pKey => {
        const lP = local.partials[pKey] || {};
        const rP = remote.partials[pKey] || {};

        if (Number(lP.continuous ?? -99) !== Number(rP.continuous ?? -99)) {
          promises.push(mutationGrade.mutateAsync({
            section: currentSection._id,
            studentId: local.studentId,
            partial: pKey,
            kind: 'continuous',
            value: lP.continuous
          }));
        }
        if (Number(lP.exam ?? -99) !== Number(rP.exam ?? -99)) {
          promises.push(mutationGrade.mutateAsync({
            section: currentSection._id,
            studentId: local.studentId,
            partial: pKey,
            kind: 'exam',
            value: lP.exam
          }));
        }
      });

      if (Number(local.substitutive ?? -99) !== Number(remote.substitutive ?? -99)) {
        promises.push(mutationSub.mutateAsync({
          section: currentSection._id,
          studentId: local.studentId,
          value: local.substitutive
        }));
      }
    }

    await Promise.all(promises);
    qc.invalidateQueries(['grades', currentSection._id]);
    setIsEditing(false);
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-300 font-normal';
    return score < 10.5 ? 'text-red-600 font-bold' : 'text-blue-600 font-semibold';
  };

  if (loadingSchedule) return <LoadingSpinner message="Cargando cursos..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* HEADER SELECTOR */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
                <Calculator className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Registro de Notas</h1>
            </div>
            
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-1">Selecciona Curso y Sección</label>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 shadow-sm"
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                >
                    <option value="">-- Seleccionar --</option>
                    {schedule.map((sect) => (
                        <option key={sect._id} value={sect._id}>
                        {sect.course?.code} - {sect.course?.name} 
                        {' '}[{sect.type === 'theory' ? 'Teoría' : 'Lab'} - Grupo {sect.group}]
                        </option>
                    ))}
                </select>
            </div>
        </div>
      </div>

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
        /* CASO: LISTA VACÍA (Solución al problema de pantalla blanca) */
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center text-yellow-800">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">Sin alumnos matriculados</h3>
            <p className="text-sm">Esta sección no tiene estudiantes inscritos todavía.</p>
        </div>
      ) : (
        /* CASO: TABLA DE NOTAS */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
            <div>
                <h3 className="font-bold text-gray-800 text-lg">
                    {currentSection.course?.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                    Grupo {currentSection.group} • {currentSection.type === 'theory' ? 'Teoría' : 'Laboratorio'}
                </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                >
                  <Edit3 size={16} /> Habilitar Edición
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setLocalGrades(JSON.parse(JSON.stringify(remoteGrades)));
                      setIsEditing(false);
                    }}
                    className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    <X size={16} /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={mutationGrade.isLoading || mutationSub.isLoading}
                    className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save size={16} /> {mutationGrade.isLoading ? 'Guardando...' : 'Guardar Todo'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 w-64 sticky left-0 bg-gray-50 z-10 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">Estudiante</th>
                  {['Fase 1', 'Fase 2', 'Fase 3'].map((fase, i) => (
                    <th key={i} colSpan={2} className="px-2 py-3 text-center border-r border-gray-200">
                      {fase}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-center border-r bg-orange-50/50 text-orange-800">Sust.</th>
                  <th className="px-4 py-3 text-center bg-gray-100 text-gray-700">Prom.</th>
                </tr>
                <tr className="border-b">
                  <th className="sticky left-0 bg-gray-50 z-10 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]"></th>
                  {['C1', 'E1', 'C2', 'E2', 'C3', 'E3'].map((h, i) => (
                    <th key={i} className="px-2 py-1 text-center text-[10px] text-gray-400 font-normal border-r">
                      {h.startsWith('C') ? 'Cont.' : 'Exam.'}
                    </th>
                  ))}
                  <th className="border-r bg-orange-50/50"></th>
                  <th className="bg-gray-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {localGrades.map((student, idx) => (
                  <tr key={student.studentId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-gray-50 transition-colors border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                      <div className="truncate w-56" title={student.studentName}>
                        {student.studentName}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">{student.code}</div>
                    </td>

                    {['P1', 'P2', 'P3'].map((pKey) => (
                      <React.Fragment key={pKey}>
                        <td className="px-1 py-2 text-center border-r border-gray-100">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              placeholder="-"
                              value={student.partials[pKey]?.continuous ?? ''}
                              onChange={(e) => updateLocalValue(idx, pKey, 'continuous', e.target.value)}
                              className="w-12 h-9 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm transition-all"
                            />
                          ) : (
                            <span className={getScoreColor(student.partials[pKey]?.continuous)}>
                              {student.partials[pKey]?.continuous ?? '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-1 py-2 text-center border-r border-gray-200 bg-gray-50/30">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              placeholder="-"
                              value={student.partials[pKey]?.exam ?? ''}
                              onChange={(e) => updateLocalValue(idx, pKey, 'exam', e.target.value)}
                              className="w-12 h-9 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-semibold transition-all"
                            />
                          ) : (
                            <span className={`font-semibold ${getScoreColor(student.partials[pKey]?.exam)}`}>
                              {student.partials[pKey]?.exam ?? '-'}
                            </span>
                          )}
                        </td>
                      </React.Fragment>
                    ))}

                    <td className="px-1 py-2 text-center border-r bg-orange-50/30">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={student.substitutive ?? ''}
                          onChange={(e) => updateSubstitutive(idx, e.target.value)}
                          className="w-12 h-9 text-center border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 text-sm bg-white"
                        />
                      ) : (
                        <span className={getScoreColor(student.substitutive)}>
                          {student.substitutive ?? '-'}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-gray-800 bg-gray-100">
                      {student.computed?.finalScore != null ? student.computed.finalScore.toFixed(1) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {isEditing && (
            <div className="p-3 bg-yellow-50 text-yellow-800 text-sm text-center border-t border-yellow-100 flex items-center justify-center gap-2 font-medium">
              <AlertCircle size={16} />
              Modo edición activo. Tus cambios no se guardarán hasta que hagas clic en "Guardar Todo".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradeManagement;
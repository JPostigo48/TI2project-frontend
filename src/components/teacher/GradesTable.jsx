import React from 'react';
import { Save, X, Edit3, AlertCircle } from 'lucide-react';

const clampScore = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const num = Number(v);
  if (Number.isNaN(num)) return null;
  return Math.max(0, Math.min(20, num));
};

const getScoreColor = (score) => {
  if (score === null || score === undefined) return 'text-gray-300 font-normal';
  return score < 10.5 ? 'text-red-600 font-bold' : 'text-blue-600 font-semibold';
};

const GradesTable = ({
  currentSection,
  localGrades,
  isEditing,
  onEnableEdit,
  onCancelEdit,
  onSave,
  saving,
  onChangePartial,
  onChangeSub,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{currentSection.course?.name}</h3>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
            Grupo {currentSection.group} • {currentSection.type === 'theory' ? 'Teoría' : 'Laboratorio'}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {!isEditing ? (
            <button
              onClick={onEnableEdit}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
            >
              <Edit3 size={16} /> Habilitar Edición
            </button>
          ) : (
            <>
              <button
                onClick={onCancelEdit}
                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <X size={16} /> Cancelar
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Todo'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-64 sticky left-0 bg-gray-50 z-10 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                Estudiante
              </th>
              {['Fase 1', 'Fase 2', 'Fase 3'].map((fase, i) => (
                <th key={i} colSpan={2} className="px-2 py-3 text-center border-r border-gray-200">
                  {fase}
                </th>
              ))}
              <th className="px-2 py-3 text-center border-r bg-orange-50/50 text-orange-800">
                Sust.
              </th>
              <th className="px-4 py-3 text-center bg-gray-100 text-gray-700">
                Prom.
              </th>
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
                          value={student.partials?.[pKey]?.continuous ?? ''}
                          onChange={(e) =>
                            onChangePartial(idx, pKey, 'continuous', clampScore(e.target.value))
                          }
                          className="w-12 h-9 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm transition-all"
                        />
                      ) : (
                        <span className={getScoreColor(student.partials?.[pKey]?.continuous)}>
                          {student.partials?.[pKey]?.continuous ?? '-'}
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
                          value={student.partials?.[pKey]?.exam ?? ''}
                          onChange={(e) =>
                            onChangePartial(idx, pKey, 'exam', clampScore(e.target.value))
                          }
                          className="w-12 h-9 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-semibold transition-all"
                        />
                      ) : (
                        <span className={`font-semibold ${getScoreColor(student.partials?.[pKey]?.exam)}`}>
                          {student.partials?.[pKey]?.exam ?? '-'}
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
                      step="0.1"
                      value={student.substitutive ?? ''}
                      onChange={(e) => onChangeSub(idx, clampScore(e.target.value))}
                      className="w-12 h-9 text-center border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 text-sm bg-white"
                    />
                  ) : (
                    <span className={getScoreColor(student.substitutive)}>{student.substitutive ?? '-'}</span>
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
  );
};

export default GradesTable;

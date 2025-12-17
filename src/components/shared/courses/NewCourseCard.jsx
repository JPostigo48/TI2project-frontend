// components/NewCourseCard.jsx
import React, { useMemo } from 'react';
import ErrorMessage from '../layout/ErrorMessage';
import StatusCard from '../common/StatusCard';

const NewCourseCard = ({
  showCourseForm,
  courseForm,
  onCourseInputChange,
  onCreateCourse,
  creatingCourse,
  onCancel,
  courseFormStatus,
  courseFormMessage,
  onToggleCourseForm,
}) => {
  const yearOptions = [1, 2, 3, 4, 5];
  const creditOptions = [1, 2, 3, 4, 5, 6, 7];

  const selectedYear = courseForm.year ? Number(courseForm.year) : null;

  const cycleOptions = useMemo(() => {
    if (!selectedYear) return [];
    const start = (selectedYear - 1) * 2 + 1;
    return [start, start + 1];
  }, [selectedYear]);

  const handleYearChange = (e) => {
    const { value } = e.target;

    onCourseInputChange({
      target: {
        name: 'year',
        value,
      },
    });

    const yearNumber = Number(value);
    if (yearNumber) {
      const start = (yearNumber - 1) * 2 + 1;
      const validCycles = [String(start), String(start + 1)];
      if (!validCycles.includes(String(courseForm.cycle))) {
        onCourseInputChange({
          target: {
            name: 'cycle',
            value: String(start),
          },
        });
      }
    }
  };

  const handleCycleChange = (e) => {
    onCourseInputChange(e);
  };

  const handleCreditsChange = (e) => {
    onCourseInputChange({
      target: {
        name: 'credits',
        value: e.target.value,
      },
    });
  };

  return (
    <StatusCard status={showCourseForm ? courseFormStatus : 'idle'} dashed>
      {showCourseForm ? (
        <form onSubmit={onCreateCourse} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Nuevo curso en el catálogo
          </h3>

          {/* Primera fila: código y nombre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="code"
              value={courseForm.code}
              onChange={onCourseInputChange}   // ✅ corregido
              placeholder="Código (e.g., CC101)"
              className="border p-2 rounded text-sm"
              required
            />
            <input
              type="text"
              name="name"
              value={courseForm.name}
              onChange={onCourseInputChange}   // ✅ corregido
              placeholder="Nombre del curso"
              className="border p-2 rounded text-sm"
              required
            />
          </div>

          {/* Segunda fila: Año, Ciclo, Créditos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Año */}
            <select
              name="year"
              value={courseForm.year || ''}
              onChange={handleYearChange}
              className="border p-2 rounded text-sm"
              required
            >
              <option value="">Año</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}° año
                </option>
              ))}
            </select>

            {/* Ciclo dependiente del año */}
            <select
              name="cycle"
              value={courseForm.cycle || ''}
              onChange={handleCycleChange}
              className="border p-2 rounded text-sm"
              required
              disabled={!selectedYear}
            >
              <option value="">
                {selectedYear ? 'Selecciona ciclo' : 'Selecciona año primero'}
              </option>
              {cycleOptions.map((cycle) => (
                <option key={cycle} value={cycle}>
                  Ciclo {cycle}
                </option>
              ))}
            </select>

            {/* Créditos */}
            <select
              name="credits"
              value={courseForm.credits || ''}
              onChange={handleCreditsChange}
              className="border p-2 rounded text-sm"
              required
            >
              <option value="">Créditos</option>
              {creditOptions.map((credit) => (
                <option key={credit} value={credit}>
                  {credit} crédito{credit > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mensajes */}
          {courseFormMessage &&
            (courseFormStatus === 'error' ? (
              <ErrorMessage message={courseFormMessage} />
            ) : (
              <p className="text-xs text-green-700">{courseFormMessage}</p>
            ))}

          {/* Botones */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creatingCourse}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {creatingCourse ? 'Creando curso...' : 'Crear curso'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={onToggleCourseForm}
          className="w-full text-xs text-gray-600 hover:text-gray-800 flex items-center justify-center py-2"
        >
          <span className="inline-flex items-center gap-1">
            <span className="text-base leading-none">+</span>
            <span>Nuevo curso en el catálogo</span>
          </span>
        </button>
      )}
    </StatusCard>
  );
};

export default NewCourseCard;

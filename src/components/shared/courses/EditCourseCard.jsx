// components/shared/courses/EditCourseCard.jsx
import React, { useMemo, useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import StatusCard from '../common/StatusCard';
import ErrorMessage from '../layout/ErrorMessage';

const EditCourseCard = ({ course, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    code: '',
    name: '',
    year: '',
    semester: '',
    credits: '',
  });

  const [status, setStatus] = useState('editing'); // idle | editing | success | error
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Inicializar formulario con los datos del curso
  useEffect(() => {
    if (!course) return;
    setForm({
      code: course.code || '',
      name: course.name || '',
      year: course.year ? String(course.year) : '',
      semester: course.semester ? String(course.semester) : '',
      credits: course.credits != null ? String(course.credits) : '',
    });
    setStatus('editing');
    setMessage('');
  }, [course]);

  const yearOptions = [1, 2, 3, 4, 5];
  const creditOptions = [1, 2, 3, 4, 5, 6, 7];

  const selectedYear = form.year ? Number(form.year) : null;

  // Ciclos/semestres según año
  // Año 1 → 1,2
  // Año 2 → 3,4
  // Año 3 → 5,6
  // Año 4 → 7,8
  // Año 5 → 9,10
  const semesterOptions = useMemo(() => {
    if (!selectedYear) return [];
    const start = (selectedYear - 1) * 2 + 1;
    return [start, start + 1];
  }, [selectedYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus('editing');
    setMessage('');
  };

  const handleYearChange = (e) => {
    const { value } = e.target;

    setForm((prev) => ({
      ...prev,
      year: value,
    }));
    setStatus('editing');
    setMessage('');

    const yearNumber = Number(value);
    if (yearNumber) {
      const start = (yearNumber - 1) * 2 + 1;
      const validSemesters = [String(start), String(start + 1)];

      if (!validSemesters.includes(String(form.semester))) {
        setForm((prev) => ({
          ...prev,
          semester: String(start),
        }));
      }
    } else {
      // Si limpia el año, limpias también el semestre
      setForm((prev) => ({ ...prev, semester: '' }));
    }
  };

  const handleCreditsChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, credits: value }));
    setStatus('editing');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course) return;

    setStatus('editing');
    setMessage('');

    if (!form.code.trim() || !form.name.trim()) {
      setStatus('error');
      setMessage('Código y nombre del curso son obligatorios.');
      return;
    }

    if (!form.year || !form.semester || !form.credits) {
      setStatus('error');
      setMessage('Año, ciclo y créditos son obligatorios.');
      return;
    }

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      year: Number(form.year),
      semester: Number(form.semester),
      credits: Number(form.credits),
    };

    setSaving(true);
    try {
      await axiosClient.put(`/courses/${course._id}`, payload);

      setStatus('success');
      setMessage('Curso actualizado correctamente.');

      if (onUpdated) {
        await onUpdated();
      }
    } catch (err) {
      setStatus('error');
      setMessage(
        err.response?.data?.message || 'Error al actualizar curso.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!course) return null;

  return (
    <StatusCard status={status} className="mt-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            Editar curso: {course.code} — {course.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cerrar
          </button>
        </div>

        {/* Código y nombre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Código (e.g., CC101)"
            className="border p-2 rounded text-sm"
            required
          />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del curso"
            className="border p-2 rounded text-sm"
            required
          />
        </div>

        {/* Año / ciclo / créditos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Año */}
          <select
            name="year"
            value={form.year}
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

          {/* Ciclo/semestre dependiente del año */}
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="border p-2 rounded text-sm"
            required
            disabled={!selectedYear}
          >
            <option value="">
              {selectedYear ? 'Selecciona ciclo' : 'Selecciona año primero'}
            </option>
            {semesterOptions.map((sem) => (
              <option key={sem} value={sem}>
                Ciclo {sem}
              </option>
            ))}
          </select>

          {/* Créditos */}
          <select
            name="credits"
            value={form.credits}
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
        {message &&
          (status === 'error' ? (
            <ErrorMessage message={message} />
          ) : (
            <p className="text-xs text-green-700">{message}</p>
          ))}

        {/* Botones */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </StatusCard>
  );
};

export default EditCourseCard;

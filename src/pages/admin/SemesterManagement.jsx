import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';

// Componente hijo para mostrar y gestionar los grupos (sections) de un curso
const CourseRow = ({ course, semesterId, onEditCourse }) => {
  const [expanded, setExpanded] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    type: 'theory',
    group: '',
    capacity: '',
  });

  const {
    data: sections = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courseSections', course._id, semesterId],
    queryFn: async () => {
      if (!semesterId) return [];
      const res = await axiosClient.get(`/courses/${course._id}/sections`, {
        params: { semester: semesterId },
      });
      return res.data;
    },
    enabled: expanded && !!semesterId,
    staleTime: 1000 * 60 * 2,
  });

  const handleGroupInputChange = (e) => {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!semesterId) {
      alert('Selecciona un semestre primero.');
      return;
    }
    if (!groupForm.group.trim()) {
      alert('Ingresa el nombre del grupo (por ej. A, B, 01).');
      return;
    }

    setCreatingGroup(true);
    try {
      // NOTA: Este endpoint debe existir en el backend
      // POST /api/sections { course, semester, type, group, capacity }
      await axiosClient.post('/sections', {
        course: course._id,
        semester: semesterId,
        type: groupForm.type,
        group: groupForm.group.trim(),
        capacity: groupForm.capacity ? Number(groupForm.capacity) : 0,
      });
      setGroupForm({ type: 'theory', group: '', capacity: '' });
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear grupo');
    } finally {
      setCreatingGroup(false);
    }
  };

  const firstLineMeta = [];
  if (course.year) firstLineMeta.push(`Año ${course.year}`);
  if (course.semester) firstLineMeta.push(`Ciclo ${course.semester}`);
  if (course.credits) firstLineMeta.push(`${course.credits} créditos`);

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">
            {course.code} — {course.name}
          </p>
          {firstLineMeta.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {firstLineMeta.join(' · ')}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEditCourse(course)}
            className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Editar curso
          </button>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="px-3 py-1 text-xs rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            disabled={!semesterId}
          >
            {expanded ? 'Ocultar grupos' : 'Ver grupos del semestre'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
          {/* Formulario de nuevo grupo */}
          <form
            onSubmit={handleCreateGroup}
            className="space-y-2 bg-gray-50 p-3 rounded-md"
          >
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Nuevo grupo para este semestre
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                name="type"
                value={groupForm.type}
                onChange={handleGroupInputChange}
                className="border p-2 rounded text-sm"
              >
                <option value="theory">Teoría</option>
                <option value="lab">Laboratorio</option>
              </select>
              <input
                type="text"
                name="group"
                value={groupForm.group}
                onChange={handleGroupInputChange}
                placeholder="Grupo (p.ej. A, B, 01)"
                className="border p-2 rounded text-sm"
                required
              />
              <input
                type="number"
                name="capacity"
                value={groupForm.capacity}
                onChange={handleGroupInputChange}
                placeholder="Capacidad (opcional)"
                className="border p-2 rounded text-sm"
                min={0}
              />
            </div>
            <button
              type="submit"
              disabled={creatingGroup || !semesterId}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {creatingGroup ? 'Creando grupo...' : 'Agregar grupo'}
            </button>
          </form>

          {/* Listado de grupos */}
          {isLoading ? (
            <p className="text-xs text-gray-500">Cargando grupos...</p>
          ) : error ? (
            <p className="text-xs text-red-600">
              Error al cargar grupos de este curso.
            </p>
          ) : sections.length === 0 ? (
            <p className="text-xs text-gray-500">
              Este curso no tiene grupos registrados en el semestre seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Capacidad
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Matriculados
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Docente
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sections.map((section) => (
                    <tr key={section._id}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {section.group}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap capitalize">
                        {section.type === 'lab' ? 'Laboratorio' : 'Teoría'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {section.capacity ?? 0}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {section.enrolledCount ?? 0}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {section.teacher?.name || 'Sin asignar'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Gestión de semestres académicos.
 * - Solo puede haber un semestre "activo" a la vez.
 * - Los semestres se clasifican según la fecha actual (pasado, activo, futuro).
 * - En esta misma pantalla se gestiona el catálogo de cursos
 *   y los grupos (sections) de cada curso por semestre.
 */
const SemesterManagement = () => {
  const [semesterForm, setSemesterForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [creatingSemester, setCreatingSemester] = useState(false);
  const [editSemester, setEditSemester] = useState(null); // {_id, name, startDate, endDate, status}

  const [selectedSemesterId, setSelectedSemesterId] = useState('');

  // Formulario para crear cursos
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
  });
  const [creatingCourse, setCreatingCourse] = useState(false);

  const today = useMemo(() => new Date(), []);

  // === React Query: Semestres ===
  const {
    data: semesters = [],
    isLoading: loadingSemesters,
    error: errorSemesters,
    refetch: refetchSemesters,
    isFetching: isFetchingSemesters,
  } = useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const res = await axiosClient.get('/semesters');
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  // Clasificar estado de semestre
  const getSemesterStatus = (sem) => {
    const start = new Date(sem.startDate);
    const end = new Date(sem.endDate);

    if (today >= start && today <= end) return 'active';
    if (today < start) return 'future';
    return 'past';
  };

  const activeSemester = useMemo(
    () => semesters.find((s) => getSemesterStatus(s) === 'active'),
    [semesters]
  );

  // Seleccionar semestre por defecto
  useEffect(() => {
    if (!semesters.length) return;
    if (selectedSemesterId) return;

    const active = semesters.find((s) => getSemesterStatus(s) === 'active');
    if (active) {
      setSelectedSemesterId(active._id);
    } else {
      const sorted = [...semesters].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setSelectedSemesterId(sorted[sorted.length - 1]._id);
    }
  }, [semesters, selectedSemesterId, today]);

  // === React Query: Catálogo de cursos ===
  const {
    data: courses = [],
    isLoading: loadingCourses,
    error: errorCourses,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ['coursesCatalog'],
    queryFn: async () => {
      const res = await axiosClient.get('/courses');
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  // ==== Handlers Semestres ====

  const handleSemesterInputChange = (e) => {
    const { name, value } = e.target;
    setSemesterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();

    if (activeSemester) {
      alert(
        `Ya existe un semestre activo (${activeSemester.name}). ` +
          'Primero ajusta su fecha de fin antes de crear uno nuevo.'
      );
      return;
    }

    setCreatingSemester(true);
    try {
      await axiosClient.post('/semesters', semesterForm);
      setSemesterForm({ name: '', startDate: '', endDate: '' });
      await refetchSemesters();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear semestre');
    } finally {
      setCreatingSemester(false);
    }
  };

  const openEditSemester = (sem) => {
    const status = getSemesterStatus(sem);
    if (status === 'past') return;

    setEditSemester({
      _id: sem._id,
      name: sem.name,
      startDate: sem.startDate.slice(0, 10),
      endDate: sem.endDate.slice(0, 10),
      status,
    });
  };

  const handleEditSemesterChange = (e) => {
    const { name, value } = e.target;
    setEditSemester((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSemesterDates = async (e) => {
    e.preventDefault();
    if (!editSemester) return;

    const payload =
      editSemester.status === 'active'
        ? { endDate: editSemester.endDate }
        : { startDate: editSemester.startDate, endDate: editSemester.endDate };

    try {
      await axiosClient.put(`/semesters/${editSemester._id}`, payload);
      setEditSemester(null);
      await refetchSemesters();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar semestre');
    }
  };

  // ==== Handlers Cursos ====

  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.code.trim() || !courseForm.name.trim()) return;

    setCreatingCourse(true);
    try {
      await axiosClient.post('/courses', {
        code: courseForm.code.trim(),
        name: courseForm.name.trim(),
      });
      setCourseForm({ code: '', name: '' });
      await refetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear curso');
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleEditCourse = async (course) => {
    const newName = prompt('Nuevo nombre del curso:', course.name);
    if (!newName) return;
    const newCode = prompt('Nuevo código del curso:', course.code || '');
    if (newCode === null || !newCode.trim()) return;

    try {
      await axiosClient.put(`/courses/${course._id}`, {
        name: newName.trim(),
        code: newCode.trim(),
      });
      await refetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar curso');
    }
  };

  if (loadingSemesters) return <p>Cargando semestres...</p>;
  if (errorSemesters) {
    return (
      <p className="text-red-600">
        Error al cargar semestres. Intenta nuevamente.
      </p>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Gestión de semestres y cursos</h1>
        {isFetchingSemesters && (
          <span className="text-xs text-gray-500">Actualizando semestres...</span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PANEL IZQUIERDO: Semestres */}
        <div className="space-y-4">
          {/* Crear semestre */}
          <form
            onSubmit={handleCreateSemester}
            className="space-y-4 bg-white p-4 shadow rounded"
          >
            <h2 className="text-lg font-semibold">Crear nuevo semestre</h2>
            {activeSemester && (
              <p className="text-xs text-red-600 mb-2">
                Ya existe un semestre activo ({activeSemester.name}). Ajusta su
                fecha de fin antes de crear uno nuevo.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                value={semesterForm.name}
                onChange={handleSemesterInputChange}
                placeholder="Nombre (e.g., 2025-A)"
                className="border p-2 rounded"
                required
                disabled={!!activeSemester}
              />
              <input
                type="date"
                name="startDate"
                value={semesterForm.startDate}
                onChange={handleSemesterInputChange}
                className="border p-2 rounded"
                required
                disabled={!!activeSemester}
              />
              <input
                type="date"
                name="endDate"
                value={semesterForm.endDate}
                onChange={handleSemesterInputChange}
                className="border p-2 rounded"
                required
                disabled={!!activeSemester}
              />
            </div>
            <button
              type="submit"
              disabled={creatingSemester || !!activeSemester}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {creatingSemester ? 'Creando...' : 'Crear semestre'}
            </button>
          </form>

          {/* Editar semestre activo / futuro */}
          {editSemester && (
            <form
              onSubmit={handleSaveSemesterDates}
              className="space-y-3 bg-white p-4 shadow rounded border border-blue-100"
            >
              <h2 className="text-lg font-semibold">
                Editar fechas de {editSemester.name}{' '}
                <span className="text-xs uppercase text-gray-500">
                  ({editSemester.status === 'active'
                    ? 'Semestre activo'
                    : 'Semestre futuro'}
                  )
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={editSemester.startDate}
                    onChange={handleEditSemesterChange}
                    className="border p-2 rounded w-full"
                    disabled={editSemester.status === 'active'}
                  />
                  {editSemester.status === 'active' && (
                    <p className="text-xs text-gray-400 mt-1">
                      No se puede modificar el inicio de un semestre ya iniciado.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={editSemester.endDate}
                    onChange={handleEditSemesterChange}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditSemester(null)}
                  className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          )}

          {/* Listado de semestres */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Semestres existentes</h2>
            <ul className="space-y-2">
              {semesters.map((sem) => {
                const status = getSemesterStatus(sem);
                const statusLabel =
                  status === 'active'
                    ? 'Activo'
                    : status === 'future'
                    ? 'Futuro'
                    : 'Pasado';
                const statusColor =
                  status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : status === 'future'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600';

                return (
                  <li
                    key={sem._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-2 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{sem.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(sem.startDate).toLocaleDateString()} –{' '}
                        {new Date(sem.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                      {(status === 'active' || status === 'future') && (
                        <button
                          type="button"
                          onClick={() => openEditSemester(sem)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Editar fechas
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* PANEL DERECHO: Cursos y grupos por semestre */}
        <div className="space-y-4">
          <div className="bg-white p-4 shadow rounded">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Cursos y grupos</h2>
                <p className="text-xs text-gray-500">
                  Elige un semestre y gestiona los grupos (teoría / laboratorio)
                  de cada curso.
                </p>
              </div>
              <div>
                <select
                  value={selectedSemesterId}
                  onChange={(e) => setSelectedSemesterId(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {semesters.map((sem) => (
                    <option key={sem._id} value={sem._id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Formulario para crear curso base */}
            <form
              onSubmit={handleCreateCourse}
              className="space-y-2 border-t border-gray-100 pt-3 mb-4"
            >
              <h3 className="text-sm font-semibold text-gray-700">
                Nuevo curso en el catálogo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="code"
                  value={courseForm.code}
                  onChange={handleCourseInputChange}
                  placeholder="Código (e.g., CC101)"
                  className="border p-2 rounded text-sm"
                  required
                />
                <input
                  type="text"
                  name="name"
                  value={courseForm.name}
                  onChange={handleCourseInputChange}
                  placeholder="Nombre del curso"
                  className="border p-2 rounded text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={creatingCourse}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
              >
                {creatingCourse ? 'Creando curso...' : 'Crear curso'}
              </button>
            </form>

            {/* Listado de cursos + grupos */}
            {loadingCourses ? (
              <p className="text-sm text-gray-500">Cargando cursos...</p>
            ) : errorCourses ? (
              <p className="text-sm text-red-600">
                Error al cargar el catálogo de cursos.
              </p>
            ) : courses.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aún no hay cursos registrados.
              </p>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {courses.map((course) => (
                  <CourseRow
                    key={course._id}
                    course={course}
                    semesterId={selectedSemesterId}
                    onEditCourse={handleEditCourse}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterManagement;

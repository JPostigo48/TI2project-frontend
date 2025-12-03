import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { ACADEMIC_HOURS } from '../../utils/constants';

// Opciones derivadas del mapa ACADEMIC_HOURS
const ACADEMIC_HOUR_OPTIONS = Object.entries(ACADEMIC_HOURS).map(
  ([value, info]) => ({
    value: Number(value),
    label: info.label,
  })
);

const DAY_LABELS = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
};

export const getTimeRangeFromBlocks = (startBlock, endBlock) => {
  if (!startBlock || !endBlock) return '';

  const start = ACADEMIC_HOURS[Number(startBlock)];
  const end = ACADEMIC_HOURS[Number(endBlock)];

  if (!start || !end) return '';

  return `${start.start} - ${end.end}`;
};

const getBlocksLabel = (startBlock, endBlock) => {
  if (!startBlock || !endBlock) return '';
  const start = ACADEMIC_HOURS[Number(startBlock)];
  const end = ACADEMIC_HOURS[Number(endBlock)];
  if (!start || !end) return '';
  if (Number(startBlock) === Number(endBlock)) return start.label;
  return `${start.label}–${end.label}`;
};

// Normaliza un bloque del back ({day, startHour, duration}) a algo entendible por el front
const normalizeBlock = (block) => {
  if (!block || !block.startHour || !block.duration) return null;
  const startBlock = block.startHour;
  const endBlock = block.startHour + block.duration - 1;
  return {
    dayOfWeek: block.day,
    startBlock,
    endBlock,
    room: block.room,
  };
};

// Devuelve el bloque principal (por ahora usamos el primero de schedule[])
const getMainBlockFromSection = (section) => {
  if (!section || !section.schedule || section.schedule.length === 0) return null;
  return normalizeBlock(section.schedule[0]);
};

const getScheduleLabel = (schedule) => {
  if (
    !schedule ||
    !schedule.dayOfWeek ||
    !schedule.startBlock ||
    !schedule.endBlock
  ) {
    return '—';
  }

  const dayKey = (schedule.dayOfWeek || '').toLowerCase();
  const dayLabel = DAY_LABELS[dayKey] || schedule.dayOfWeek;
  const blocksLabel = getBlocksLabel(schedule.startBlock, schedule.endBlock);
  const timeRange = getTimeRangeFromBlocks(
    schedule.startBlock,
    schedule.endBlock
  );

  return `${dayLabel} ${blocksLabel} (${timeRange})`;
};

const CourseSectionsManager = ({
  course,
  semesterId,
  onEditCourse,
  teachers = [],
  rooms = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);

  const [groupForm, setGroupForm] = useState({
    type: 'theory',
    group: '',
    capacity: '',
    teacher: '',
    dayOfWeek: '',
    startBlock: '',
    endBlock: '',
    room: '',
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editSectionForm, setEditSectionForm] = useState({
    type: 'theory',
    group: '',
    capacity: '',
    teacher: '',
    dayOfWeek: '',
    startBlock: '',
    endBlock: '',
    room: '',
  });

  // para el dropdown de horarios extra
  const [openScheduleSectionId, setOpenScheduleSectionId] = useState(null);

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
    if (!groupForm.dayOfWeek || !groupForm.startBlock || !groupForm.endBlock) {
      alert('Completa al menos un bloque de horario (día, inicio y fin).');
      return;
    }

    const startBlockNum = Number(groupForm.startBlock);
    const endBlockNum = Number(groupForm.endBlock);

    setCreatingGroup(true);
    try {
      await axiosClient.post('/sections', {
        course: course._id,
        semester: semesterId,
        type: groupForm.type,
        group: groupForm.group.trim(),
        capacity: groupForm.capacity ? Number(groupForm.capacity) : 0,
        teacher: groupForm.teacher || null,
        // IMPORTANTE: formato del back → array de bloques
        schedule: [
          {
            day: groupForm.dayOfWeek,
            startHour: startBlockNum,
            duration: endBlockNum - startBlockNum + 1,
            room: groupForm.room || null,
          },
        ],
      });
      setGroupForm({
        type: 'theory',
        group: '',
        capacity: '',
        teacher: '',
        dayOfWeek: '',
        startBlock: '',
        endBlock: '',
        room: '',
      });
      setShowGroupForm(false);
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear grupo');
    } finally {
      setCreatingGroup(false);
    }
  };

  const startEditingSection = (section) => {
    setEditingSection(section);

    const mainBlock = getMainBlockFromSection(section) || {};
    const room =
      mainBlock.room?._id ||
      mainBlock.room ||
      '';

    setEditSectionForm({
      type: section.type || 'theory',
      group: section.group || '',
      capacity: section.capacity ?? '',
      teacher: section.teacher?._id || '',
      dayOfWeek: mainBlock.dayOfWeek || '',
      startBlock: mainBlock.startBlock || '',
      endBlock: mainBlock.endBlock || '',
      room,
    });
  };

  const handleEditSectionChange = (e) => {
    const { name, value } = e.target;
    setEditSectionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    if (!editSectionForm.group.trim()) {
      alert('El grupo debe tener un nombre.');
      return;
    }
    if (
      !editSectionForm.dayOfWeek ||
      !editSectionForm.startBlock ||
      !editSectionForm.endBlock
    ) {
      alert('Completa al menos un bloque de horario.');
      return;
    }

    const startBlockNum = Number(editSectionForm.startBlock);
    const endBlockNum = Number(editSectionForm.endBlock);

    try {
      await axiosClient.put(`/sections/${editingSection._id}`, {
        type: editSectionForm.type,
        group: editSectionForm.group.trim(),
        capacity: editSectionForm.capacity
          ? Number(editSectionForm.capacity)
          : 0,
        teacher: editSectionForm.teacher || null,
        schedule: [
          {
            day: editSectionForm.dayOfWeek,
            startHour: startBlockNum,
            duration: endBlockNum - startBlockNum + 1,
            room: editSectionForm.room || null,
          },
        ],
      });
      setEditingSection(null);
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar grupo');
    }
  };

  const toggleScheduleDropdown = (sectionId) => {
    setOpenScheduleSectionId((prev) =>
      prev === sectionId ? null : sectionId
    );
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
            <>
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
                        Horario
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Aula
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Docente
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sections.map((section) => {
                      const mainBlock = getMainBlockFromSection(section);
                      const roomObj = mainBlock?.room;
                      const roomLabel =
                        roomObj?.name ||
                        roomObj?.code ||
                        (typeof roomObj === 'string' ? roomObj : 'Sin aula');

                      const hasMultipleBlocks =
                        Array.isArray(section.schedule) &&
                        section.schedule.length > 1;

                      return (
                        <React.Fragment key={section._id}>
                          <tr>
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
                              <div className="flex flex-col gap-1">
                                <span>{getScheduleLabel(mainBlock)}</span>
                                {hasMultipleBlocks && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleScheduleDropdown(section._id)
                                    }
                                    className="text-[10px] text-indigo-600 hover:underline text-left"
                                  >
                                    {openScheduleSectionId === section._id
                                      ? 'Ocultar horarios'
                                      : `Ver ${section.schedule.length} horarios`}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {roomLabel || 'Sin aula'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {section.teacher?.name ||
                                section.teacher?.fullName ||
                                'Sin asignar'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right">
                              <button
                                type="button"
                                onClick={() => startEditingSection(section)}
                                className="text-xs text-indigo-600 hover:underline"
                              >
                                Editar
                              </button>
                            </td>
                          </tr>

                          {/* Dropdown con todos los bloques de horario */}
                          {openScheduleSectionId === section._id && (
                            <tr className="bg-gray-50">
                              <td colSpan={8} className="px-3 py-2">
                                <p className="text-[11px] font-semibold text-gray-700 mb-1">
                                  Horarios de la sección {section.group}
                                </p>
                                <ul className="space-y-1 text-[11px] text-gray-700">
                                  {section.schedule.map((block, idx) => {
                                    const normalized = normalizeBlock(block);
                                    const label = getScheduleLabel(normalized);

                                    const roomB =
                                      block.room?.name ||
                                      block.room?.code ||
                                      (typeof block.room === 'string'
                                        ? block.room
                                        : '');

                                    return (
                                      <li
                                        key={idx}
                                        className="flex flex-wrap gap-2 items-center"
                                      >
                                        <span>• {label}</span>
                                        {roomB && (
                                          <span className="text-gray-500">
                                            — Aula: {roomB}
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Editor de grupo + horario (dropdown) */}
              {editingSection && (
                <form
                  onSubmit={handleSaveSection}
                  className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2"
                >
                  <p className="text-xs font-semibold text-gray-700">
                    Editando grupo {editingSection.group}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <select
                      name="type"
                      value={editSectionForm.type}
                      onChange={handleEditSectionChange}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="theory">Teoría</option>
                      <option value="lab">Laboratorio</option>
                    </select>
                    <input
                      type="text"
                      name="group"
                      value={editSectionForm.group}
                      onChange={handleEditSectionChange}
                      placeholder="Grupo"
                      className="border p-2 rounded text-sm"
                    />
                    <input
                      type="number"
                      name="capacity"
                      value={editSectionForm.capacity}
                      onChange={handleEditSectionChange}
                      placeholder="Capacidad"
                      className="border p-2 rounded text-sm"
                      min={0}
                    />
                    <select
                      name="teacher"
                      value={editSectionForm.teacher}
                      onChange={handleEditSectionChange}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Docente (opcional)</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.fullName || t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <select
                      name="dayOfWeek"
                      value={editSectionForm.dayOfWeek}
                      onChange={handleEditSectionChange}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Día de la semana</option>
                      <option value="monday">Lunes</option>
                      <option value="tuesday">Martes</option>
                      <option value="wednesday">Miércoles</option>
                      <option value="thursday">Jueves</option>
                      <option value="friday">Viernes</option>
                      <option value="saturday">Sábado</option>
                    </select>

                    <select
                      name="startBlock"
                      value={editSectionForm.startBlock}
                      onChange={handleEditSectionChange}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Bloque inicio</option>
                      {ACADEMIC_HOUR_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-col gap-1">
                      <select
                        name="endBlock"
                        value={editSectionForm.endBlock}
                        onChange={handleEditSectionChange}
                        className="border p-2 rounded text-sm"
                      >
                        <option value="">Bloque fin</option>
                        {ACADEMIC_HOUR_OPTIONS.map((b) => (
                          <option key={b.value} value={b.value}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        readOnly
                        className="border p-2 rounded text-[11px] bg-gray-100 text-gray-600"
                        value={
                          getTimeRangeFromBlocks(
                            editSectionForm.startBlock,
                            editSectionForm.endBlock
                          ) ||
                          'Selecciona bloques para ver horario (ej. 3ra–4ta → 08:50-10:30)'
                        }
                      />
                    </div>

                    <select
                      name="room"
                      value={editSectionForm.room}
                      onChange={handleEditSectionChange}
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Aula (opcional)</option>
                      {rooms.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.name || r.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Bloquecito "+" para crear nuevo grupo */}
          <div className="border border-dashed border-gray-300 rounded-md bg-gray-50 p-3">
            {showGroupForm ? (
              <form onSubmit={handleCreateGroup} className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Nuevo grupo para este semestre
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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
                    placeholder="Grupo (A, B, 01)"
                    className="border p-2 rounded text-sm"
                    required
                  />
                  <input
                    type="number"
                    name="capacity"
                    value={groupForm.capacity}
                    onChange={handleGroupInputChange}
                    placeholder="Capacidad"
                    className="border p-2 rounded text-sm"
                    min={0}
                  />
                  <select
                    name="teacher"
                    value={groupForm.teacher}
                    onChange={handleGroupInputChange}
                    className="border p-2 rounded text-sm"
                  >
                    <option value="">Docente (opcional)</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.fullName || t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <select
                    name="dayOfWeek"
                    value={groupForm.dayOfWeek}
                    onChange={handleGroupInputChange}
                    className="border p-2 rounded text-sm"
                    required
                  >
                    <option value="">Día de la semana</option>
                    <option value="monday">Lunes</option>
                    <option value="tuesday">Martes</option>
                    <option value="wednesday">Miércoles</option>
                    <option value="thursday">Jueves</option>
                    <option value="friday">Viernes</option>
                    <option value="saturday">Sábado</option>
                  </select>

                  <select
                    name="startBlock"
                    value={groupForm.startBlock}
                    onChange={handleGroupInputChange}
                    className="border p-2 rounded text-sm"
                    required
                  >
                    <option value="">Bloque inicio</option>
                    {ACADEMIC_HOUR_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-col gap-1">
                    <select
                      name="endBlock"
                      value={groupForm.endBlock}
                      onChange={handleGroupInputChange}
                      className="border p-2 rounded text-sm"
                      required
                    >
                      <option value="">Bloque fin</option>
                      {ACADEMIC_HOUR_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      readOnly
                      className="border p-2 rounded text-[11px] bg-gray-100 text-gray-600"
                      value={
                        getTimeRangeFromBlocks(
                          groupForm.startBlock,
                          groupForm.endBlock
                        ) ||
                        'Selecciona bloques para ver horario (ej. 3ra–4ta → 08:50-10:30)'
                      }
                    />
                  </div>

                  <select
                    name="room"
                    value={groupForm.room}
                    onChange={handleGroupInputChange}
                    className="border p-2 rounded text-sm"
                  >
                    <option value="">Aula (opcional)</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name || r.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={creatingGroup || !semesterId}
                    className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {creatingGroup ? 'Creando grupo...' : 'Agregar grupo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGroupForm(false)}
                    className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowGroupForm(true)}
                className="w-full text-xs text-gray-600 hover:text-gray-800 flex items-center justify-center py-2"
              >
                <span className="inline-flex items-center gap-1">
                  <span className="text-base leading-none">+</span>
                  <span>Nuevo grupo para este curso</span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSectionsManager;

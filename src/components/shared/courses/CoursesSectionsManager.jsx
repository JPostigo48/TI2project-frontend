import React, { useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import { useQuery } from '@tanstack/react-query';
import NewGroupCard from './NewGroupCard';
import EditSectionForm from './EditSectionForm';
import SectionsTable from './SectionsTable';
import ENDPOINTS from '../../../api/endpoints';
import LoadingSpinner from '../layout/LoadingSpinner';
import ErrorMessage from '../layout/ErrorMessage';
import StatusCard from '../common/StatusCard';
import EditCourseCard from './EditCourseCard';

const CourseSectionsManager = ({
  course,
  semesterId,
  teachers = [],
  rooms = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);

  const [groupFormStatus, setGroupFormStatus] = useState('idle');   // idle | editing | success | error
  const [groupFormMessage, setGroupFormMessage] = useState('');

  const [editFormStatus, setEditFormStatus] = useState('idle');
  const [editFormMessage, setEditFormMessage] = useState('');

  const [groupForm, setGroupForm] = useState({
    type: 'theory',
    group: '',
    capacity: '',
    teacher: '',
    schedules: [
      { dayOfWeek: '', startBlock: '', endBlock: '', room: '' },
    ],
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editSectionForm, setEditSectionForm] = useState({
    type: 'theory',
    group: '',
    capacity: '',
    teacher: '',
    schedules: [],
  });

  // para el toggle de filas de horario
  const [openScheduleSectionId, setOpenScheduleSectionId] = useState(null);

  const [isEditingCourse, setIsEditingCourse] = useState(false);

  const {
    data: sections = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courseSections', course._id, semesterId],
    queryFn: async () => {
      if (!semesterId) return [];
      const res = await axiosClient.get(ENDPOINTS.ADMIN.SECTIONS_IN_COURSE(course._id), {
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
    setGroupFormStatus('editing');
    setGroupFormMessage('');
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupFormStatus('editing');
    setGroupFormMessage('');

    if (!semesterId) {
      setGroupFormStatus('error');
      setGroupFormMessage('Selecciona un semestre primero.');
      return;
    }
    if (!groupForm.group.trim()) {
      setGroupFormStatus('error');
      setGroupFormMessage('Ingresa el nombre del grupo (por ej. A, B, 01).');
      return;
    }
    if (!groupForm.teacher) {
      setGroupFormStatus('error');
      setGroupFormMessage('Selecciona un docente.');
      return;
    }

    const validSchedules = (groupForm.schedules || []).filter(
      (s) => s.dayOfWeek && s.startBlock && s.endBlock && s.room
    );

    if (validSchedules.length === 0) {
      setGroupFormStatus('error');
      setGroupFormMessage(
        'Agrega al menos un horario completo (día, inicio, fin y aula).'
      );
      return;
    }

    const schedulePayload = [];

    for (const s of validSchedules) {
      const startBlockNum = Number(s.startBlock);
      const endBlockNum = Number(s.endBlock);

      if (endBlockNum < startBlockNum) {
        setGroupFormStatus('error');
        setGroupFormMessage('El bloque fin no puede ser menor que el inicio.');
        return;
      }

      schedulePayload.push({
        day: s.dayOfWeek,
        startHour: startBlockNum,
        duration: endBlockNum - startBlockNum + 1,
        room: s.room || null,
      });
    }

    setCreatingGroup(true);
    try {
      await axiosClient.post('/sections', {
        course: course._id,
        semester: semesterId,
        type: groupForm.type,
        group: groupForm.group.trim(),
        capacity: groupForm.capacity ? Number(groupForm.capacity) : 0,
        teacher: groupForm.teacher,
        schedule: schedulePayload,
      });

      setGroupForm({
        type: 'theory',
        group: '',
        capacity: '',
        teacher: '',
        schedules: [
          { dayOfWeek: '', startBlock: '', endBlock: '', room: '' },
        ],
      });
      setGroupFormStatus('success');
      setGroupFormMessage('Grupo creado correctamente.');
      setShowGroupForm(false);
      await refetch();
    } catch (err) {
      setGroupFormStatus('error');
      setGroupFormMessage(
        err.response?.data?.message || 'Error al crear grupo'
      );
    } finally {
      setCreatingGroup(false);
    }
  };


  const startEditingSection = (section) => {
    setEditingSection(section);

    const schedules = (section.schedule || []).map((block) => {
      const startBlock = block.startHour;
      const endBlock = block.startHour + (block.duration || 1) - 1;
      return {
        dayOfWeek: block.day,
        startBlock: String(startBlock),
        endBlock: String(endBlock),
        room:
          block.room?._id ||
          block.room || 
          '',
      };
    });

    setEditSectionForm({
      type: section.type || 'theory',
      group: section.group || '',
      capacity: section.capacity ?? '',
      teacher: section.teacher?._id || '',
      schedules: schedules.length ? schedules : [{ dayOfWeek: '', startBlock: '', endBlock: '', room: '' }],
    });
  };


  const handleEditSectionChange = (e) => {
    const { name, value } = e.target;
    setEditSectionForm((prev) => ({ ...prev, [name]: value }));
    setEditFormStatus('editing');
    setEditFormMessage('');
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    setEditFormStatus('editing');
    setEditFormMessage('');

    if (!editSectionForm.group.trim()) {
      setEditFormStatus('error');
      setEditFormMessage('El grupo debe tener un nombre.');
      return;
    }

    if (!editSectionForm.teacher) {
      setEditFormStatus('error');
      setEditFormMessage('Selecciona un docente.');
      return;
    }

    const validSchedules = (editSectionForm.schedules || []).filter(
      (s) => s.dayOfWeek && s.startBlock && s.endBlock && s.room
    );

    if (validSchedules.length === 0) {
      setEditFormStatus('error');
      setEditFormMessage(
        'Agrega al menos un horario completo (día, inicio, fin y aula).'
      );
      return;
    }

    const schedulePayload = [];

    for (const s of validSchedules) {
      const startBlockNum = Number(s.startBlock);
      const endBlockNum = Number(s.endBlock);

      if (endBlockNum < startBlockNum) {
        setEditFormStatus('error');
        setEditFormMessage('El bloque fin no puede ser menor que el inicio.');
        return;
      }

      schedulePayload.push({
        day: s.dayOfWeek,
        startHour: startBlockNum,
        duration: endBlockNum - startBlockNum + 1,
        room: s.room || null,
      });
    }

    try {
      await axiosClient.post(ENDPOINTS.COMMON.COURSE_EDIT(editingSection._id), {
        type: editSectionForm.type,
        group: editSectionForm.group.trim(),
        capacity: editSectionForm.capacity
          ? Number(editSectionForm.capacity)
          : 0,
        teacher: editSectionForm.teacher,
        schedule: schedulePayload,
      });

      setEditFormStatus('success');
      setEditFormMessage('Grupo actualizado correctamente.');
      setEditingSection(null);
      await refetch();
    } catch (error) {
      setEditFormStatus('error');
      setEditFormMessage(
        `Error al actualizar grupo${error.message ? ': '+error.message : ''}`
      );
    }
  };

  const toggleScheduleRow = (sectionId) => {
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
            onClick={() => setIsEditingCourse(true)}
            className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Editar curso
          </button>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="w-44 px-3 py-1 text-xs rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            disabled={!semesterId}
          >
            {expanded ? 'Ocultar grupos' : 'Ver grupos del semestre'}
          </button>
        </div>
      </div>

      {isEditingCourse && (
        <EditCourseCard
          course={course}
          onClose={() => setIsEditingCourse(null)}
        />
      )}


      {expanded && (
        <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
          {isLoading ? (
            <LoadingSpinner message="Cargando grupos..." />
          ) : error ? (
            <ErrorMessage message="Error al cargar grupos de este curso." />
          ) : (
            <>
              <SectionsTable
                sections={sections}
                openSectionId={openScheduleSectionId}
                onToggleSection={toggleScheduleRow}
                onEditSection={startEditingSection}
              />

              {editingSection && (
                <StatusCard status={editFormStatus || 'editing'} className="mt-2">
                  <EditSectionForm
                    editingSection={editingSection}
                    editSectionForm={editSectionForm}
                    teachers={teachers}
                    rooms={rooms}
                    onChange={handleEditSectionChange}
                    onCancel={() => {
                      setEditingSection(null);
                      setEditFormStatus('idle');
                      setEditFormMessage('');
                    }}
                    onSubmit={handleSaveSection}
                  />
                  {editFormMessage && (
                    // <p
                    //   className={`mt-1 text-xs ${
                    //     editFormStatus === 'error'
                    //       ? 'text-red-700'
                    //       : 'text-green-700'
                    //   }`}
                    // >
                    //   {editFormMessage}
                    // </p>
                    <div className='mt-3'>
                      <ErrorMessage message={editFormMessage}/>
                    </div>
                  )}
                </StatusCard>
              )}
            </>
          )}

          <StatusCard
            status={showGroupForm ? groupFormStatus : 'idle'}
            dashed
            className="mt-2"
          >
            <NewGroupCard
              semesterId={semesterId}
              groupForm={groupForm}
              creatingGroup={creatingGroup}
              showGroupForm={showGroupForm}
              teachers={teachers}
              rooms={rooms}
              onChange={handleGroupInputChange}
              onSubmit={handleCreateGroup}
              onCancel={() => {
                setShowGroupForm((prev) => !prev);
                setGroupFormStatus('idle');
                setGroupFormMessage('');
              }}
            />
            {groupFormMessage && (
              <p
                className={`mt-1 text-xs ${
                  groupFormStatus === 'error' ? 'text-red-700' : 'text-green-700'
                }`}
              >
                {groupFormMessage}
              </p>
            )}
          </StatusCard>
        </div>
      )}

    </div>
  );
};

export default CourseSectionsManager;

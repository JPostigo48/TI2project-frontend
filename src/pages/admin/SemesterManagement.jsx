import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import ENDPOINTS from '../../api/endpoints';
import SemestersPanel from '../../components/shared/semesters/SemestersPanel';
import CoursesPanel from '../../components/shared/courses/CoursesPanel';
import { formatDateUTC } from '../../utils/helpers';

// Mapea estado de formulario a color de fondo
const getFormBgClass = (status) => {
  switch (status) {
    case 'editing':
      return 'bg-blue-50';
    case 'success':
      return 'bg-green-50';
    case 'error':
      return 'bg-red-50';
    default:
      return 'bg-gray-50';
  }
};

const SemesterManagement = () => {
  // ====== STATE GENERAL ======
  const [semesterForm, setSemesterForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [creatingSemester, setCreatingSemester] = useState(false);
  const [editSemester, setEditSemester] = useState(null); // {_id, name, startDate, endDate, status}
  const [selectedSemesterId, setSelectedSemesterId] = useState('');

  const [semesterFormStatus, setSemesterFormStatus] = useState('idle'); // idle | editing | success | error
  const [semesterFormMessage, setSemesterFormMessage] = useState('');

  const [editSemesterStatus, setEditSemesterStatus] = useState('idle');
  const [editSemesterMessage, setEditSemesterMessage] = useState('');

  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
  });
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [courseFormStatus, setCourseFormStatus] = useState('idle');
  const [courseFormMessage, setCourseFormMessage] = useState('');

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSemesterForm, setShowSemesterForm] = useState(false);

  // 🔴 Estado global para acciones de matrícula de laboratorios
  const [labActionStatus, setLabActionStatus] = useState('idle'); // idle | loading | success | error
  const [labActionMessage, setLabActionMessage] = useState('');

  const today = useMemo(() => new Date(), []);

  // ====== QUERIES: SEMESTRES ======
  const {
    data: semesters = [],
    isLoading: loadingSemesters,
    error: errorSemesters,
    refetch: refetchSemesters,
    isFetching: isFetchingSemesters,
  } = useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const res = await axiosClient.get(ENDPOINTS.COMMON.SEMESTERS);
      console.log(res.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

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

  // ====== QUERIES: CURSOS / DOCENTES / ROOMS ======
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

  const {
    data: teachers = [],
    isLoading: loadingTeachers,
    error: errorTeachers,
  } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axiosClient.get('/teacher');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: rooms = [],
    isLoading: loadingRooms,
    error: errorRooms,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await axiosClient.get('/rooms');
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  // ====== HANDLERS: SEMESTRES ======
  const handleSemesterInputChange = (e) => {
    const { name, value } = e.target;
    setSemesterForm((prev) => ({ ...prev, [name]: value }));
    setSemesterFormStatus('editing');
    setSemesterFormMessage('');
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();

    setSemesterFormMessage('');
    setSemesterFormStatus('editing');

    // ⛔ BLOQUEO: no se puede crear si hay uno activo
    if (activeSemester) {
      setSemesterFormStatus('error');
      setSemesterFormMessage(
        `Ya existe un semestre activo (${activeSemester.name}). Ajusta su fecha de fin antes de crear uno nuevo.`
      );
      return;
    }

    try {
      setCreatingSemester(true);
      await axiosClient.post(ENDPOINTS.COMMON.SEMESTER_CREATE, semesterForm);
      setSemesterForm({ name: '', startDate: '', endDate: '' });
      setSemesterFormStatus('success');
      setSemesterFormMessage('Semestre creado correctamente.');
      await refetchSemesters();
    } catch (err) {
      setSemesterFormStatus('error');
      setSemesterFormMessage(
        err.response?.data?.message || 'Error al crear semestre'
      );
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
    setEditSemesterStatus('editing');
    setEditSemesterMessage('');
  };

  const handleEditSemesterChange = (e) => {
    const { name, value } = e.target;
    setEditSemester((prev) => ({ ...prev, [name]: value }));
    setEditSemesterStatus('editing');
    setEditSemesterMessage('');
  };

  const handleSaveSemesterDates = async (e) => {
    e.preventDefault();
    if (!editSemester) return;

    const payload = {
      name: editSemester.name,
      startDate: editSemester.startDate,
      endDate: editSemester.endDate,
    };

    if (new Date(payload.startDate) >= new Date(payload.endDate)) {
      setEditSemesterStatus('error');
      setEditSemesterMessage(
        'La fecha de inicio debe ser menor que la fecha de fin.'
      );
      return;
    }

    try {
      await axiosClient.post(
        ENDPOINTS.COMMON.SEMESTER_EDIT(editSemester._id),
        payload
      );
      setEditSemesterStatus('success');
      setEditSemesterMessage('Fechas de semestre actualizadas correctamente.');
      await refetchSemesters();
    } catch (err) {
      setEditSemesterStatus('error');
      setEditSemesterMessage(
        err.response?.data?.message || 'Error al actualizar semestre'
      );
    }
  };

  // ====== Helpers de error/success para labs ======
  const setLabError = (msg) => {
    setLabActionStatus('error');
    setLabActionMessage(msg);
  };

  const setLabSuccess = (msg) => {
    setLabActionStatus('success');
    setLabActionMessage(msg);
  };

  // ====== HANDLERS: MATRÍCULA DE LABORATORIOS ======
  const handleStartLabsEnrollment = async (semester) => {
    if (!semester?._id) return;

    setLabActionStatus('loading');
    setLabActionMessage('');

    try {
      await axiosClient.post(
        ENDPOINTS.COMMON.SEMESTER_LAB_OPEN(semester._id)
      );

      await axiosClient.post(
        ENDPOINTS.COMMON.SEMESTER_LAB_PREPROCESS(semester._id)
      );

      setLabSuccess(`Matrícula de laboratorios abierta para ${semester.name}.`);
      await refetchSemesters();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error al abrir la matrícula de laboratorios.';
      setLabError(msg);
    }
  };

  const handleCloseLabsEnrollment = async (semester) => {
    if (!semester?._id) return;

    setLabActionStatus('loading');
    setLabActionMessage('');

    try {
      await axiosClient.post(
        ENDPOINTS.COMMON.SEMESTER_LAB_CLOSE(semester._id)
      );

      await axiosClient.post(
        ENDPOINTS.COMMON.SEMESTER_LAB_PROCESS(semester._id)
      );

      setLabSuccess(
        `Matrículas de laboratorio procesadas correctamente en ${semester.name}.`
      );

      await refetchSemesters();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error al cerrar o procesar las matrículas de laboratorio.';
      setLabError(msg);
    }
  };

  const handleViewLabsResults = async (semester) => {
    if (!semester?._id) return;

    setLabActionStatus('loading');
    setLabActionMessage('');

    try {
      const res = await axiosClient.get(
        ENDPOINTS.COMMON.SEMESTER_LAB_RESULTS(semester._id)
      );

      console.log('Resultados:', res.data);
      setLabSuccess(
        `Resultados cargados para ${semester.name}. (Revisar consola)`
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error al obtener los resultados de laboratorios.';
      setLabError(msg);
    }
  };

  // ====== HANDLERS: CURSOS ======
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
    setCourseFormStatus('editing');
    setCourseFormMessage('');
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.code.trim() || !courseForm.name.trim()) {
      setCourseFormStatus('error');
      setCourseFormMessage('Código y nombre del curso son obligatorios.');
      return;
    }

    try {
      setCreatingCourse(true);
      await axiosClient.post('/courses', {
        code: courseForm.code.trim(),
        name: courseForm.name.trim(),
      });
      setCourseForm({ code: '', name: '' });
      setCourseFormStatus('success');
      setCourseFormMessage('Curso creado correctamente.');
      await refetchCourses();
    } catch (err) {
      setCourseFormStatus('error');
      setCourseFormMessage(
        err.response?.data?.message || 'Error al crear curso'
      );
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleEditCourse = (course) => {
    // suponiendo que luego habrá un modal, etc.
    console.log('Editar curso', course);
  };

  const semesterFormBgClass = getFormBgClass(
    showSemesterForm ? semesterFormStatus : 'idle'
  );
  const courseFormBgClass = getFormBgClass(
    showCourseForm ? courseFormStatus : 'idle'
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Gestión de semestres y cursos</h1>
        {isFetchingSemesters && (
          <span className="text-xs text-gray-500">Actualizando semestres...</span>
        )}
      </div>

      <div className="space-y-6">
        {/* PANEL: Semestres */}
        <SemestersPanel
          semesters={semesters}
          activeSemester={activeSemester}
          showSemesterForm={showSemesterForm}
          onToggleSemesterForm={() => {
            setShowSemesterForm((prev) => !prev);
            setSemesterFormStatus('editing');
            setSemesterFormMessage('');
          }}
          semesterForm={semesterForm}
          semesterFormStatus={semesterFormStatus}
          semesterFormMessage={semesterFormMessage}
          creatingSemester={creatingSemester}
          onSemesterInputChange={handleSemesterInputChange}
          onCreateSemester={handleCreateSemester}
          onOpenEditSemester={openEditSemester}
          formatDateUTC={formatDateUTC}
          getSemesterStatus={getSemesterStatus}
          editSemester={editSemester}
          editSemesterStatus={editSemesterStatus}
          editSemesterMessage={editSemesterMessage}
          onEditSemesterChange={handleEditSemesterChange}
          onCancelEditSemester={() => {
            setEditSemester(null);
            setEditSemesterStatus('idle');
            setEditSemesterMessage('');
          }}
          onSaveSemesterDates={handleSaveSemesterDates}
          loadingSemesters={loadingSemesters}
          errorSemesters={errorSemesters}
          labActionStatus={labActionStatus}
          labActionMessage={labActionMessage}
          onStartLabsEnrollment={handleStartLabsEnrollment}
          onCloseLabsEnrollment={handleCloseLabsEnrollment}
          onViewLabsResults={handleViewLabsResults}
        />

        {/* PANEL: Cursos y grupos */}
        <CoursesPanel
          semesters={semesters}
          selectedSemesterId={selectedSemesterId}
          onChangeSelectedSemester={setSelectedSemesterId}
          courses={courses}
          loadingCourses={loadingCourses}
          errorCourses={errorCourses}
          teachers={teachers}
          loadingTeachers={loadingTeachers}
          errorTeachers={errorTeachers}
          rooms={rooms}
          loadingRooms={loadingRooms}
          errorRooms={errorRooms}
          showCourseForm={showCourseForm}
          onToggleCourseForm={() => {
            setShowCourseForm((prev) => !prev);
            setCourseFormStatus('editing');
            setCourseFormMessage('');
          }}
          courseForm={courseForm}
          courseFormStatus={courseFormStatus}
          courseFormMessage={courseFormMessage}
          courseFormBgClass={courseFormBgClass}
          creatingCourse={creatingCourse}
          onCourseInputChange={handleCourseInputChange}
          onCreateCourse={handleCreateCourse}
          onEditCourse={handleEditCourse}
        />
      </div>
    </div>
  );
};

export default SemesterManagement;

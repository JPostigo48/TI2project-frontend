// pages/student/StudentGrades.jsx
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import StudentService from "../../services/student.service";
import LoadingSpinner from "../../components/shared/layout/LoadingSpinner";
import ErrorMessage from "../../components/shared/layout/ErrorMessage";
import { calculateStats } from "../../utils/helpers";
import StudentGradesTable from "../../components/student/StudentGradesTable";

const StudentGrades = () => {
  const {
    data: gradesRaw = [],
    isLoading: loadingGrades,
    error: errorGrades,
  } = useQuery({
    queryKey: ["studentGrades"],
    queryFn: () => StudentService.getGrades(),
    staleTime: 1000 * 30,
  });

  const {
    data: scheduleBlocks = [],
    isLoading: loadingSchedule,
    error: errorSchedule,
  } = useQuery({
    queryKey: ["studentSchedule"],
    queryFn: () => StudentService.getSchedule(),
    staleTime: 1000 * 60,
  });

  // ✅ 1) Construir rows SIEMPRE (aunque esté loading), para no romper orden de hooks
  const rows = useMemo(() => {
    const map = new Map();

    // Base desde horario: muestra cursos aunque no haya notas aún
    if (Array.isArray(scheduleBlocks)) {
      scheduleBlocks.forEach((b) => {
        if (!b) return;

        const courseCode = b.courseCode || b.course?.code;
        const courseName = b.courseName || b.course?.name;
        const group = b.group || b.section?.group || "";
        const sectionType = b.type || b.sectionType || b.section?.type || "theory";

        if (!courseCode) return;

        const key = `${courseCode}-${group}-${sectionType}`;

        if (!map.has(key)) {
          map.set(key, {
            rowKey: key,
            courseCode,
            courseName: courseName || "Curso sin nombre",
            group,
            sectionType, // 'theory' | 'lab'
            partials: {},
            substitutive: null,
            computed: { finalScore: null },
          });
        }
      });
    }

    // Merge notas desde backend
    if (Array.isArray(gradesRaw)) {
      gradesRaw.forEach((g) => {
        if (!g) return;

        const courseCode = g.courseCode || g.course?.code;
        const courseName = g.courseName || g.course?.name;
        const group = g.group || g.section?.group || "";
        const sectionType = g.type || g.sectionType || g.section?.type || "theory";

        if (!courseCode) return;

        const key = `${courseCode}-${group}-${sectionType}`;

        if (!map.has(key)) {
          map.set(key, {
            rowKey: key,
            courseCode,
            courseName: courseName || "Curso sin nombre",
            group,
            sectionType,
            partials: {},
            substitutive: null,
            computed: { finalScore: null },
          });
        }

        const row = map.get(key);

        row.partials = g.partials || row.partials || {};
        row.computed = g.computed || row.computed || {};

        // Sustitutorio solo para teoría
        if (sectionType === "theory") {
          row.substitutive =
            g.substitutive !== undefined ? g.substitutive : row.substitutive;
        } else {
          row.substitutive = null;
        }
      });
    }

    const arr = Array.from(map.values());

    // Orden: por código, luego teoría antes que lab, luego grupo
    arr.sort((a, b) => {
      const c = String(a.courseCode).localeCompare(String(b.courseCode));
      if (c !== 0) return c;

      const ta = a.sectionType === "theory" ? 0 : 1;
      const tb = b.sectionType === "theory" ? 0 : 1;
      if (ta !== tb) return ta - tb;

      return String(a.group || "").localeCompare(String(b.group || ""));
    });

    return arr;
  }, [gradesRaw, scheduleBlocks]);

  // ✅ 2) Stats siempre (hook arriba)
  const stats = useMemo(() => {
    const finals = rows
      .map((r) =>
        r.computed?.finalScore != null ? Number(r.computed.finalScore) : null
      )
      .filter((x) => x != null);

    if (!finals.length) return null;
    return calculateStats(finals);
  }, [rows]);

  // ✅ 3) Recién aquí returns tempranos (después de hooks)
  if (loadingGrades || loadingSchedule) {
    return <LoadingSpinner message="Cargando notas..." />;
  }

  if (errorGrades || errorSchedule) {
    return <ErrorMessage message="Error al cargar notas u horario" />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Mis Notas</h1>

        {stats ? (
          <div className="flex gap-2 flex-wrap">
            <div className="card">Promedio: {stats.avg}</div>
            <div className="card">Máxima: {stats.max}</div>
            <div className="card">Mínima: {stats.min}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Aún no hay promedios calculados.
          </div>
        )}
      </div>

      <StudentGradesTable rows={rows} />
    </div>
  );
};

export default StudentGrades;

// pages/student/StudentDashboard.jsx
import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  FileText,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

import StudentService from '../../services/student.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';
import NextClassCard from '../../components/shared/NextClassCard';

// ✅ Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const clamp20 = (v) => Math.max(0, Math.min(20, v));

const StudentDashboard = () => {
  const { user } = useAuth();

  const {
    data: schedule = [],
    isLoading: loadingSchedule,
    error: errorSchedule,
  } = useQuery({
    queryKey: ['studentSchedule'],
    queryFn: () => StudentService.getSchedule(),
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: gradesRaw = [],
    isLoading: loadingGrades,
    error: errorGrades,
  } = useQuery({
    queryKey: ['studentGrades'],
    queryFn: () => StudentService.getGrades(),
    staleTime: 1000 * 60 * 2,
  });

  // 1) Horario plano para NextClassCard
  const flatSchedule = useMemo(() => {
    if (!Array.isArray(schedule)) return [];
    return schedule.map((block) => ({
      day: block.day,
      startHour: Number(block.startHour),
      duration: Number(block.duration || 1),
      room: block.room,
      courseName: block.courseName || 'Curso',
      code: block.courseCode,
      group: block.group,
      type: block.type || 'theory',
    }));
  }, [schedule]);

  // 2) Cursos activos + merge con notas
  const dashboard = useMemo(() => {
    const courseMap = new Map();

    if (Array.isArray(flatSchedule)) {
      flatSchedule.forEach((b) => {
        if (!b?.code) return;
        const key = `${b.code}-${b.group || ''}-${b.type || 'theory'}`;
        if (!courseMap.has(key)) {
          courseMap.set(key, {
            rowKey: key,
            courseCode: b.code,
            courseName: b.courseName,
            group: b.group,
            sectionType: b.type || 'theory',
            partials: {},
            substitutive: null,
            computed: { finalScore: null },
          });
        }
      });
    }

    if (Array.isArray(gradesRaw)) {
      gradesRaw.forEach((g) => {
        if (!g?.courseCode) return;

        const type = g.sectionType || g.type || 'theory';
        const key = `${g.courseCode}-${g.group || ''}-${type}`;

        if (!courseMap.has(key)) {
          courseMap.set(key, {
            rowKey: key,
            courseCode: g.courseCode,
            courseName: g.courseName || 'Curso',
            group: g.group,
            sectionType: type,
            partials: {},
            substitutive: null,
            computed: { finalScore: null },
          });
        }

        const row = courseMap.get(key);
        row.partials = g.partials || row.partials;
        row.substitutive =
          g.substitutive !== undefined ? g.substitutive : row.substitutive;
        row.computed = g.computed || row.computed;
      });
    }

    const rows = Array.from(courseMap.values());

    const finals = rows
      .map((r) =>
        r.computed?.finalScore != null ? Number(r.computed.finalScore) : null
      )
      .filter((v) => v != null);

    const avgFinal = finals.length
      ? clamp20(finals.reduce((a, b) => a + b, 0) / finals.length)
      : 0;

    const riskCourses = rows.filter((r) => {
      const f = r.computed?.finalScore;
      return f != null && Number(f) < 10.5;
    });

    const best =
      rows
        .filter((r) => r.computed?.finalScore != null)
        .sort(
          (a, b) =>
            Number(b.computed.finalScore) - Number(a.computed.finalScore)
        )[0] || null;

    const worst =
      rows
        .filter((r) => r.computed?.finalScore != null)
        .sort(
          (a, b) =>
            Number(a.computed.finalScore) - Number(b.computed.finalScore)
        )[0] || null;

    const phaseAvg = (pKey) => {
      const vals = [];
      rows.forEach((r) => {
        const p = r.partials?.[pKey];
        if (!p) return;

        if (r.sectionType === 'lab') {
          if (p.avg != null) vals.push(Number(p.avg));
          return;
        }

        const c = p.continuous;
        const e = p.exam;
        if (c != null && e != null) vals.push((Number(c) + Number(e)) / 2);
        else if (c != null || e != null)
          vals.push((Number(c || 0) + Number(e || 0)) / 2);
      });

      if (!vals.length) return null;
      return clamp20(vals.reduce((a, b) => a + b, 0) / vals.length);
    };

    const p1 = phaseAvg('P1');
    const p2 = phaseAvg('P2');
    const p3 = phaseAvg('P3');

    const dist = { low: 0, mid: 0, high: 0, top: 0 };
    finals.forEach((f) => {
      if (f < 10.5) dist.low += 1;
      else if (f < 15) dist.mid += 1;
      else if (f < 18) dist.high += 1;
      else dist.top += 1;
    });

    const weeklyHours = flatSchedule.reduce(
      (acc, b) => acc + (Number(b.duration) || 1),
      0
    );

    return {
      rows,
      avgFinal: Number(avgFinal.toFixed(1)),
      countedCourses: finals.length,
      totalCourses: rows.length,
      riskCount: riskCourses.length,
      best,
      worst,
      trend: { P1: p1, P2: p2, P3: p3 },
      dist,
      weeklyHours,
    };
  }, [flatSchedule, gradesRaw]);

  // ==========================
  // ✅ CHART: Rendimiento por curso (C1/E1/C2/E2/C3/E3)
  // (HOOK ARRIBA, antes de returns)
  // ==========================
  const includeLabs = true;

  const palette = useMemo(
    () => [
      '#2563eb', '#16a34a', '#7c3aed', '#dc2626', '#0ea5e9',
      '#f97316', '#db2777', '#059669', '#6366f1', '#9333ea',
    ],
    []
  );

  const chart = useMemo(() => {
    const xLabels = ['C1', 'E1', 'C2', 'E2', 'C3', 'E3'];

    const seriesRows = (dashboard.rows || []).filter((r) => {
      if (!r?.courseCode) return false;
      if (r.sectionType === 'lab' && !includeLabs) return false;

      const p = r.partials || {};
      const hasTheoryAny =
        p?.P1?.continuous != null ||
        p?.P1?.exam != null ||
        p?.P2?.continuous != null ||
        p?.P2?.exam != null ||
        p?.P3?.continuous != null ||
        p?.P3?.exam != null;

      const hasLabAny =
        p?.P1?.avg != null || p?.P2?.avg != null || p?.P3?.avg != null;

      return r.sectionType === 'lab' ? hasLabAny : hasTheoryAny;
    });

    const seriesMeta = seriesRows.map((r) => {
      const label = `${r.courseCode} — ${r.courseName}${
        r.sectionType === 'lab' ? ' (Lab)' : ''
      }`;
      return {
        key: r.rowKey,
        label,
        row: r,
      };
    });

    const data = xLabels.map((x) => ({ x }));

    const setPoint = (dataArr, xKey, seriesKey, value) => {
      const idx = xLabels.indexOf(xKey);
      if (idx >= 0) dataArr[idx][seriesKey] = value == null ? null : Number(value);
    };

    seriesMeta.forEach(({ key, row }) => {
      const p = row.partials || {};

      if (row.sectionType === 'lab') {
        setPoint(data, 'C1', key, null);
        setPoint(data, 'E1', key, p?.P1?.avg ?? null);
        setPoint(data, 'C2', key, null);
        setPoint(data, 'E2', key, p?.P2?.avg ?? null);
        setPoint(data, 'C3', key, null);
        setPoint(data, 'E3', key, p?.P3?.avg ?? null);
      } else {
        setPoint(data, 'C1', key, p?.P1?.continuous ?? null);
        setPoint(data, 'E1', key, p?.P1?.exam ?? null);
        setPoint(data, 'C2', key, p?.P2?.continuous ?? null);
        setPoint(data, 'E2', key, p?.P2?.exam ?? null);
        setPoint(data, 'C3', key, p?.P3?.continuous ?? null);
        setPoint(data, 'E3', key, p?.P3?.exam ?? null);
      }
    });

    return { data, seriesMeta };
  }, [dashboard.rows, includeLabs]);

  const CustomTooltip = useCallback(
    ({ active, payload, label }) => {
      if (!active || !payload?.length) return null;

      const items = payload
        .filter((p) => p?.value != null)
        .map((p) => {
          const meta = chart.seriesMeta.find((m) => m.key === p.dataKey);
          return {
            name: meta?.label || p.dataKey,
            value: Number(p.value).toFixed(1),
            color: p.stroke,
          };
        });

      if (!items.length) return null;

      return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2">
          <div className="text-xs font-semibold text-gray-700 mb-1">{label}</div>
          <div className="space-y-1">
            {items.map((it) => (
              <div
                key={it.name}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: it.color }}
                  />
                  <span className="text-gray-700">{it.name}</span>
                </div>
                <span className="font-bold text-gray-900">{it.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    },
    [chart.seriesMeta]
  );

  // ✅ recién aquí hacemos returns tempranos
  if (loadingGrades || loadingSchedule)
    return <LoadingSpinner message="Cargando tu panel..." />;
  if (errorGrades || errorSchedule)
    return <ErrorMessage message="No pudimos cargar tu información." />;

  const avgPct = Math.min(100, (Number(dashboard.avgFinal || 0) / 20) * 100);

  const trendLabel = (() => {
    const { P1, P2, P3 } = dashboard.trend || {};
    const vals = [P1, P2, P3].filter((v) => v != null);
    if (vals.length < 2)
      return {
        text: 'Aún no hay suficientes notas por fases',
        tone: 'text-gray-500',
      };
    const last = vals[vals.length - 1];
    const prev = vals[vals.length - 2];
    const diff = last - prev;
    if (Math.abs(diff) < 0.25)
      return {
        text: 'Estás estable respecto a la fase anterior',
        tone: 'text-gray-600',
      };
    if (diff > 0)
      return {
        text: `Mejoraste +${diff.toFixed(1)} vs. fase anterior`,
        tone: 'text-green-700',
      };
    return {
      text: `Bajaste ${diff.toFixed(1)} vs. fase anterior`,
      tone: 'text-red-700',
    };
  })();

  const quickLinks = [
    {
      title: 'Mi Horario',
      description: 'Ver mi horario de clases',
      icon: Calendar,
      color: 'blue',
      path: ROUTES.STUDENT_SCHEDULE,
    },
    {
      title: 'Mis Notas',
      description: 'Ver notas y desempeño',
      icon: FileText,
      color: 'green',
      path: ROUTES.STUDENT_GRADES,
    },
    {
      title: 'Laboratorios',
      description: 'Inscripción a laboratorios',
      icon: GraduationCap,
      color: 'purple',
      path: ROUTES.STUDENT_LABS,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-blue-100 opacity-90 max-w-md">
            Tienes{' '}
            <span className="font-bold text-white">
              {dashboard.totalCourses || 0} cursos
            </span>{' '}
            en tu carga actual.
          </p>
          <div className="mt-6 inline-flex bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
            <span className="text-sm font-medium">Código: {user?.code}</span>
          </div>
        </div>

        <div className="lg:col-span-1 h-full">
          <NextClassCard schedule={flatSchedule} />
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`card p-6 rounded-xl border border-transparent ${getColorClasses(
                  link.color
                )} transition-all hover:shadow-md hover:scale-[1.02] duration-200 block`}
              >
                <Icon size={32} className="mb-3" />
                <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
                <p className="text-sm opacity-80">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* MÉTRICAS */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen Académico</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Promedio */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Promedio actual</h3>
                <p className="text-xs text-gray-500">
                  Basado en cursos con nota registrada ({dashboard.countedCourses}/{dashboard.totalCourses})
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {dashboard.avgFinal || '0.0'}
                </span>
                <span className="text-sm text-gray-500">/ 20.0</span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${avgPct}%` }}
                />
              </div>

              <p className={`text-sm ${trendLabel.tone}`}>{trendLabel.text}</p>
            </div>
          </div>

          {/* Riesgo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Cursos en riesgo</h3>
                <p className="text-xs text-gray-500">Final &lt; 10.5 (si ya hay nota)</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{dashboard.riskCount}</span>
              <span className="text-sm text-gray-500">curso(s)</span>
            </div>

            {dashboard.riskCount === 0 ? (
              <p className="mt-3 text-sm text-green-700">
                Vas bien: no hay cursos por debajo de 10.5.
              </p>
            ) : (
              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <p className="text-gray-600">Revisa estos primero en “Mis Notas”.</p>
                <Link
                  to={ROUTES.STUDENT_GRADES}
                  className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:underline"
                >
                  Ver detalle <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Distribución */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-indigo-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Distribución de finales</h3>
                <p className="text-xs text-gray-500">Solo cursos con nota</p>
              </div>
            </div>

            {dashboard.countedCourses === 0 ? (
              <p className="text-sm text-gray-500">
                Aún no hay notas finales registradas.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                {[
                  { label: '0–10.4', value: dashboard.dist.low, hint: 'Riesgo' },
                  { label: '10.5–14.9', value: dashboard.dist.mid, hint: 'Aprobado' },
                  { label: '15–17.9', value: dashboard.dist.high, hint: 'Bien' },
                  { label: '18–20', value: dashboard.dist.top, hint: 'Excelente' },
                ].map((x) => {
                  const pct = dashboard.countedCourses
                    ? (x.value / dashboard.countedCourses) * 100
                    : 0;
                  return (
                    <div key={x.label}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>
                          {x.label}{' '}
                          <span className="text-gray-400">({x.hint})</span>
                        </span>
                        <span className="font-semibold text-gray-800">{x.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-indigo-500 to-sky-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Highlights + CHART */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Highlights</h3>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                <p className="text-xs text-green-700 font-bold uppercase tracking-wide">
                  Mejor curso
                </p>
                {dashboard.best ? (
                  <>
                    <p className="mt-1 font-semibold text-gray-900">
                      {dashboard.best.courseName}{' '}
                      <span className="text-gray-400">
                        ({dashboard.best.courseCode})
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Final:{' '}
                      <span className="font-bold text-green-700">
                        {Number(dashboard.best.computed.finalScore).toFixed(1)}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Aún sin notas suficientes.
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                <p className="text-xs text-rose-700 font-bold uppercase tracking-wide">
                  A reforzar
                </p>
                {dashboard.worst ? (
                  <>
                    <p className="mt-1 font-semibold text-gray-900">
                      {dashboard.worst.courseName}{' '}
                      <span className="text-gray-400">
                        ({dashboard.worst.courseCode})
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Final:{' '}
                      <span className="font-bold text-rose-700">
                        {Number(dashboard.worst.computed.finalScore).toFixed(1)}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Aún sin notas suficientes.
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-600">
                Tip: si un curso está bajo, revisa si te falta “C” o “E” en alguna fase.
              </div>
            </div>
          </div>

          {/* ✅ CHART */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <LineChartIcon className="text-sky-700" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Evolución por evaluaciones
                </h3>
                <p className="text-xs text-gray-500">
                  Eje X: C1 E1 C2 E2 C3 E3 • Hover para ver curso y nota
                </p>
              </div>
            </div>

            {chart.seriesMeta.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aún no hay notas suficientes para graficar.
              </div>
            ) : (
              <div className="h-80 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chart.data}
                    margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis domain={[0, 20]} tickCount={6} />
                    <Tooltip content={CustomTooltip} />
                    <Legend />

                    {chart.seriesMeta.map((s, idx) => (
                      <Line
                        key={s.key}
                        type="monotone"
                        dataKey={s.key}
                        name={s.label}
                        stroke={palette[idx % palette.length]}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400">
              Nota: En cursos de laboratorio, se grafica el promedio por fase en E1/E2/E3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

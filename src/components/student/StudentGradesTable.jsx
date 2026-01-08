// components/shared/grades/StudentGradesTable.jsx
import React, { useMemo } from "react";

const getScoreColor = (score) => {
  if (score === null || score === undefined) return "text-gray-300 font-normal";
  return score < 10.5 ? "text-red-600 font-bold" : "text-blue-600 font-semibold";
};

const fmt = (v) => (v === null || v === undefined ? "-" : v);

// ====== Sub-renderers ======
const TheoryRow = ({ row, showSub }) => {
  const p1c = row.partials?.P1?.continuous ?? null;
  const p1e = row.partials?.P1?.exam ?? null;
  const p2c = row.partials?.P2?.continuous ?? null;
  const p2e = row.partials?.P2?.exam ?? null;
  const p3c = row.partials?.P3?.continuous ?? null;
  const p3e = row.partials?.P3?.exam ?? null;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-gray-50 transition-colors border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
        <div className="font-medium text-gray-900 truncate" title={row.courseName}>
          {row.courseName} <span className="text-gray-400">({row.courseCode})</span>
        </div>
        <div className="text-xs text-gray-400">Grupo {row.group || "-"}</div>
      </td>

      {/* P1 */}
      <td className="px-2 py-3 text-center border-r">
        <span className={getScoreColor(p1c)}>{fmt(p1c)}</span>
      </td>
      <td className="px-2 py-3 text-center border-r bg-gray-50/30">
        <span className={getScoreColor(p1e)}>{fmt(p1e)}</span>
      </td>

      {/* P2 */}
      <td className="px-2 py-3 text-center border-r">
        <span className={getScoreColor(p2c)}>{fmt(p2c)}</span>
      </td>
      <td className="px-2 py-3 text-center border-r bg-gray-50/30">
        <span className={getScoreColor(p2e)}>{fmt(p2e)}</span>
      </td>

      {/* P3 */}
      <td className="px-2 py-3 text-center border-r">
        <span className={getScoreColor(p3c)}>{fmt(p3c)}</span>
      </td>
      <td className="px-2 py-3 text-center border-r bg-gray-50/30">
        <span className={getScoreColor(p3e)}>{fmt(p3e)}</span>
      </td>

      {/* Sust */}
      {showSub && (
        <td className="px-2 py-3 text-center border-r bg-orange-50/30">
          <span className={getScoreColor(row.substitutive)}>{fmt(row.substitutive)}</span>
        </td>
      )}

      {/* Final */}
      <td className="px-4 py-3 text-center font-bold text-gray-800 bg-gray-100">
        {row.computed?.finalScore != null ? Number(row.computed.finalScore).toFixed(1) : "-"}
      </td>
    </tr>
  );
};

const LabRow = ({ row }) => {
  const p = (k) => row.partials?.[k] || {};
  const cell = (k) => {
    const avg = p(k).avg ?? null;
    const done = p(k).done ?? null;
    const total = p(k).total ?? 6;
    return (
      <div className="text-center">
        <div className={getScoreColor(avg)}>{fmt(avg)}</div>
        <div className="text-[10px] text-gray-400">{done == null ? "-" : `${done}/${total}`} labs</div>
      </div>
    );
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-gray-50 transition-colors border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
        <div className="font-medium text-gray-900 truncate" title={row.courseName}>
          {row.courseName} <span className="text-gray-400">({row.courseCode})</span>
        </div>
        <div className="text-xs text-gray-400">Grupo {row.group || "-"}</div>
      </td>

      <td className="px-2 py-3 text-center border-r">{cell("P1")}</td>
      <td className="px-2 py-3 text-center border-r">{cell("P2")}</td>
      <td className="px-2 py-3 text-center border-r">{cell("P3")}</td>

      <td className="px-4 py-3 text-center font-bold text-gray-800 bg-gray-100">
        {row.computed?.finalScore != null ? Number(row.computed.finalScore).toFixed(1) : "-"}
      </td>
    </tr>
  );
};

// ====== Main ======
const StudentGradesTable = ({ rows = [] }) => {
  const { theoryRows, labRows } = useMemo(() => {
    const theory = [];
    const lab = [];
    rows.forEach((r) => {
      if ((r.sectionType || "theory") === "lab") lab.push(r);
      else theory.push(r);
    });

    const sorter = (a, b) => {
      const c = String(a.courseCode || "").localeCompare(String(b.courseCode || ""));
      if (c !== 0) return c;
      return String(a.group || "").localeCompare(String(b.group || ""));
    };

    theory.sort(sorter);
    lab.sort(sorter);

    return { theoryRows: theory, labRows: lab };
  }, [rows]);

  const hasAny = rows.length > 0;
  const showSub = theoryRows.length > 0; // si hay teoría, mostramos columna susti en tabla de teoría

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-800 text-lg">Mis notas</h3>
        <p className="text-xs text-gray-500">
          Teoría: columnas separadas de Continua/Examen • Labs: promedio por fase y (hechos/6)
        </p>
      </div>

      {!hasAny && (
        <div className="p-6 text-center text-gray-500">
          No hay cursos matriculados ni notas registradas.
        </div>
      )}

      {/* ==================== TEORÍA ==================== */}
      {theoryRows.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3 bg-white">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Teoría</p>
              <span className="text-xs text-gray-400">
                C = Continua • E = Examen
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th
                    rowSpan={2}
                    className="px-4 py-3 w-[360px] sticky left-0 bg-gray-50 z-10 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]"
                  >
                    Curso
                  </th>
                  <th colSpan={2} className="px-2 py-3 text-center border-r">
                    P1
                  </th>
                  <th colSpan={2} className="px-2 py-3 text-center border-r">
                    P2
                  </th>
                  <th colSpan={2} className="px-2 py-3 text-center border-r">
                    P3
                  </th>
                  {showSub && (
                    <th
                      rowSpan={2}
                      className="px-2 py-3 text-center border-r bg-orange-50/50 text-orange-800"
                    >
                      Sust.
                    </th>
                  )}
                  <th rowSpan={2} className="px-4 py-3 text-center bg-gray-100 text-gray-700">
                    Final
                  </th>
                </tr>
                <tr className="border-b">
                  {["C", "E", "C", "E", "C", "E"].map((h, i) => (
                    <th
                      key={i}
                      className={[
                        "px-2 py-1 text-center text-[10px] text-gray-400 font-normal border-r",
                        h === "E" ? "bg-gray-50/30" : "",
                      ].join(" ")}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {theoryRows.map((row) => (
                  <TheoryRow key={row.rowKey} row={row} showSub={showSub} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== LABS ==================== */}
      {labRows.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3 bg-white">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Laboratorios</p>
              <span className="text-xs text-gray-400">
                P1/P2/P3: promedio por fase • (hechos/6)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 w-[360px] sticky left-0 bg-gray-50 z-10 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                    Curso
                  </th>
                  {["P1", "P2", "P3"].map((p) => (
                    <th key={p} className="px-3 py-3 text-center border-r">
                      {p}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center bg-gray-100 text-gray-700">
                    Final
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {labRows.map((row) => (
                  <LabRow key={row.rowKey} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGradesTable;

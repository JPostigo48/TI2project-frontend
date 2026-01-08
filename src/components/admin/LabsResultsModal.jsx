import React, { useMemo, useState, useEffect } from "react";
import { X, Search } from "lucide-react";

const norm = (s) => String(s || "").toLowerCase().trim();

const LabResultsModal = ({ open, onClose, results = [], semesterName }) => {
  const [q, setQ] = useState("");
  const [groupByCourse, setGroupByCourse] = useState(true);

  // limpiar búsqueda al abrir
  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!open) return [];
    const query = norm(q);
    if (!query) return results;

    return results.filter((r) => {
      const haystack = [
        r.studentName,
        r.studentCode,
        r.studentEmail,
        r.courseName,
        r.courseCode,
        r.labGroup,
      ]
        .map(norm)
        .join(" | ");
      return haystack.includes(query);
    });
  }, [open, results, q]);

  const grouped = useMemo(() => {
    if (!groupByCourse) return null;

    const map = new Map();
    filtered.forEach((r) => {
      const key = r.courseId || r.courseCode || "unknown";
      if (!map.has(key)) {
        map.set(key, {
          courseCode: r.courseCode || "-",
          courseName: r.courseName || "Curso",
          items: [],
        });
      }
      map.get(key).items.push(r);
    });

    // orden por courseCode
    return Array.from(map.values()).sort((a, b) =>
      String(a.courseCode).localeCompare(String(b.courseCode))
    );
  }, [filtered, groupByCourse]);

  const copyCsv = async () => {
    const header = [
      "courseCode",
      "courseName",
      "labGroup",
      "studentCode",
      "studentName",
      "studentEmail",
    ];
    const rows = filtered.map((r) =>
      [
        r.courseCode,
        r.courseName,
        r.labGroup,
        r.studentCode,
        r.studentName,
        r.studentEmail,
      ]
        .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
        .join(",")
    );

    const csv = [header.join(","), ...rows].join("\n");
    try {
      await navigator.clipboard.writeText(csv);
      // si quieres, aquí puedes disparar tu toast
      // setLabSuccess("CSV copiado al portapapeles")
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = csv;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Matrículas de Laboratorio
              </h3>
              <p className="text-xs text-gray-500">
                {semesterName ? `Semestre: ${semesterName} • ` : ""}
                {filtered.length} registro(s)
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          {/* controls */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por alumno, código, correo, curso o grupo..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGroupByCourse((v) => !v)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                {groupByCourse ? "Ver lista plana" : "Agrupar por curso"}
              </button>

              <button
                type="button"
                onClick={copyCsv}
                className="px-3 py-2 text-xs rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Copiar CSV
              </button>
            </div>
          </div>

          {/* body */}
          <div className="max-h-[70vh] overflow-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay resultados para ese filtro.
              </div>
            ) : groupByCourse ? (
              <div className="p-4 space-y-4">
                {grouped.map((g) => (
                  <div key={`${g.courseCode}-${g.courseName}`} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">
                        {g.courseName}{" "}
                        <span className="text-gray-400">({g.courseCode})</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {g.items.length} alumno(s)
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs uppercase text-gray-500 bg-white border-b">
                          <tr>
                            <th className="px-4 py-2 text-left">Alumno</th>
                            <th className="px-4 py-2 text-left">Código</th>
                            <th className="px-4 py-2 text-left">Correo</th>
                            <th className="px-4 py-2 text-center">Grupo Lab</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {g.items.map((r) => (
                            <tr key={`${r.studentId}-${r.labSectionId}`} className="hover:bg-gray-50">
                              <td className="px-4 py-2 font-medium text-gray-900">
                                {r.studentName || "-"}
                              </td>
                              <td className="px-4 py-2 font-mono text-xs text-gray-600">
                                {r.studentCode || "-"}
                              </td>
                              <td className="px-4 py-2 text-gray-700">
                                {r.studentEmail || "-"}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-200 text-xs font-semibold">
                                  {r.labGroup || "-"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Curso</th>
                      <th className="px-4 py-3 text-center">Grupo</th>
                      <th className="px-4 py-3 text-left">Alumno</th>
                      <th className="px-4 py-3 text-left">Código</th>
                      <th className="px-4 py-3 text-left">Correo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((r) => (
                      <tr key={`${r.studentId}-${r.labSectionId}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {r.courseName}{" "}
                            <span className="text-gray-400">({r.courseCode})</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-200 text-xs font-semibold">
                            {r.labGroup || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {r.studentName || "-"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {r.studentCode || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {r.studentEmail || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultsModal;

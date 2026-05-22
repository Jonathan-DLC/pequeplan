"use client";

import { useEffect, useState } from "react";
import { ReporteService, ResenaService } from "@/lib/services";
import { Reporte, Actividad, Resena } from "@/lib/models";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [actMap, setActMap] = useState<Map<string, string>>(new Map());
  const [resenaMap, setResenaMap] = useState<Map<string, Resena>>(new Map());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!db) { setCargando(false); return; }
    Promise.all([
      new ReporteService().listarTodos(),
      getDocs(collection(db, "actividades")),
      getDocs(collection(db, "resenas")),
    ]).then(([r, actSnap, resSnap]) => {
      setReportes(r);
      const aMap = new Map<string, string>();
      actSnap.docs.forEach((d) => { const a = d.data() as Actividad; aMap.set(a.id, a.nombre); });
      setActMap(aMap);
      const rMap = new Map<string, Resena>();
      resSnap.docs.forEach((d) => { const res = d.data() as Resena; rMap.set(res.id, res); });
      setResenaMap(rMap);
      setCargando(false);
    });
  }, []);

  const resolver = async (id: string) => {
    await new ReporteService().resolver(id);
    setReportes((prev) => prev.map((r) => r.id === id ? { ...r, estado: "RESUELTO" } : r));
  };

  const eliminarResena = async (resenaId: string, reporteId: string) => {
    if (!db || !confirm("¿Eliminar esta reseña inapropiada?")) return;
    await deleteDoc(doc(db, "resenas", resenaId));
    await new ReporteService().resolver(reporteId);
    setReportes((prev) => prev.map((r) => r.id === reporteId ? { ...r, estado: "RESUELTO" } : r));
    setResenaMap((prev) => { const copy = new Map(prev); copy.delete(resenaId); return copy; });
  };

  if (cargando) {
    return <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  const pendientes = reportes.filter((r) => r.estado === "PENDIENTE");
  const resueltos = reportes.filter((r) => r.estado === "RESUELTO");

  const renderReporte = (r: Reporte, showActions: boolean) => {
    const resena = r.tipo === "resena" ? resenaMap.get(r.referenciaId) : null;
    const actNombre = r.tipo === "actividad" ? actMap.get(r.referenciaId) : resena ? actMap.get(resena.actividadId) : actMap.get(r.actividadId || "");
    const actId = r.tipo === "actividad" ? r.referenciaId : r.actividadId || resena?.actividadId;

    return (
      <div key={r.id} className={`rounded-2xl p-4 ${showActions ? "bg-yellow-50" : "bg-slate-50 opacity-60"}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-700">{r.tipo === "actividad" ? "📋 Actividad" : "💬 Reseña"}</span>
              {actNombre && actId && (
                <a href={`/actividad/${actId}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-caribe-50 text-caribe-700 rounded px-1.5 py-0.5 hover:underline">{actNombre} ↗</a>
              )}
            </div>
            <p className="text-xs text-red-600 font-medium">Motivo: {r.motivo}</p>
            {r.descripcion && <p className="text-xs text-slate-600 mt-1">{r.descripcion}</p>}
            <div className="mt-2 text-xs text-slate-500">
              <span>Reportado por: <strong>{r.nombreReportante || "—"}</strong></span>
              {r.contactoReportante && <span> · {r.contactoReportante}</span>}
            </div>
            {resena && (
              <div className="mt-2 rounded-lg bg-white border border-slate-100 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-yellow-500">{"★".repeat(resena.estrellas)}{"☆".repeat(5 - resena.estrellas)}</span>
                  <span className="text-xs font-medium text-slate-600">{resena.nombreUsuario}</span>
                </div>
                <p className="text-sm text-slate-600">{resena.comentario}</p>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-1">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</p>
          </div>
          {showActions && (
            <div className="flex gap-2 ml-3">
              {r.tipo === "resena" && resena && (
                <button onClick={() => eliminarResena(r.referenciaId, r.id)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200">
                  🗑️ Eliminar reseña
                </button>
              )}
              <button onClick={() => resolver(r.id)} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200">
                ✓ Resolver
              </button>
            </div>
          )}
          {!showActions && <span className="text-xs text-green-600">Resuelto</span>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">🚩 Reportes</h1>

      {reportes.length === 0 ? (
        <p className="text-sm text-slate-500">No hay reportes.</p>
      ) : (
        <>
          {pendientes.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-yellow-700 mb-3">Pendientes ({pendientes.length})</h2>
              <div className="space-y-3">{pendientes.map((r) => renderReporte(r, true))}</div>
            </div>
          )}
          {resueltos.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 mb-3">Resueltos ({resueltos.length})</h2>
              <div className="space-y-2">{resueltos.map((r) => renderReporte(r, false))}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

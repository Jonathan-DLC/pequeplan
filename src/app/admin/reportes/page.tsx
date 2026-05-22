"use client";

import { useEffect, useState } from "react";
import { ReporteService } from "@/lib/services";
import { Reporte, Actividad } from "@/lib/models";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [actMap, setActMap] = useState<Map<string, string>>(new Map());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      new ReporteService().listarTodos(),
      db ? getDocs(collection(db, "actividades")) : Promise.resolve(null),
    ]).then(([r, snap]) => {
      setReportes(r);
      if (snap) {
        const map = new Map<string, string>();
        snap.docs.forEach((d) => { const a = d.data() as Actividad; map.set(a.id, a.nombre); });
        setActMap(map);
      }
      setCargando(false);
    });
  }, []);

  const resolver = async (id: string) => {
    await new ReporteService().resolver(id);
    setReportes((prev) => prev.map((r) => r.id === id ? { ...r, estado: "RESUELTO" } : r));
  };

  if (cargando) {
    return <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  const pendientes = reportes.filter((r) => r.estado === "PENDIENTE");
  const resueltos = reportes.filter((r) => r.estado === "RESUELTO");

  const getNombre = (r: Reporte) => {
    if (r.tipo === "actividad") return actMap.get(r.referenciaId) || r.referenciaId.slice(0, 8) + "...";
    return "Reseña " + r.referenciaId.slice(0, 8) + "...";
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
              <div className="space-y-3">
                {pendientes.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-2xl bg-yellow-50 p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{r.tipo === "actividad" ? "📋" : "💬"} {getNombre(r)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Motivo: {r.motivo}</p>
                      <p className="text-xs text-slate-400">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</p>
                    </div>
                    <button onClick={() => resolver(r.id)} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200">
                      ✓ Resolver
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {resueltos.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 mb-3">Resueltos ({resueltos.length})</h2>
              <div className="space-y-2">
                {resueltos.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 opacity-60">
                    <div>
                      <p className="text-sm text-slate-600">{r.tipo === "actividad" ? "📋" : "💬"} {getNombre(r)}</p>
                      <p className="text-xs text-slate-400">Motivo: {r.motivo} · {new Date(r.creadoEn).toLocaleDateString("es-CO")}</p>
                    </div>
                    <span className="text-xs text-green-600">Resuelto</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ReservaService } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Reserva } from "@/lib/models";

export default function MisInscripciones() {
  const { user, loading, loginConGoogle } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [actMap, setActMap] = useState<Map<string, Actividad>>(new Map());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { setCargando(false); return; }
    new ReservaService().listarPorUsuario(user.uid).then((r) => {
      setReservas(r.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)));
      const repo = new LocalStorageRepository<Actividad>("actividades");
      const map = new Map<string, Actividad>();
      r.forEach((res) => {
        const act = repo.obtenerPorId(res.actividadId);
        if (act) map.set(act.id, act);
      });
      setActMap(map);
      setCargando(false);
    });
  }, [user, loading]);

  const cancelar = async (id: string) => {
    await new ReservaService().cancelar(id);
    setReservas((prev) => prev.map((r) => r.id === id ? { ...r, estado: "CANCELADA" } : r));
  };

  if (loading || cargando) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-4xl mb-4">📋</p>
        <h1 className="text-xl font-bold text-slate-700 mb-2">Mis Inscripciones</h1>
        <p className="text-sm text-slate-500 mb-6">Inicia sesión para ver tus inscripciones.</p>
        <button onClick={loginConGoogle} className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
          Iniciar con Google
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-700 mb-8">📋 Mis Inscripciones</h1>

      {reservas.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">🎈</p>
          <p className="text-lg font-semibold text-slate-700">No tienes inscripciones</p>
          <p className="mt-2 text-sm text-slate-500">Explora actividades e inscribe a tu hijo/a</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => {
            const act = actMap.get(r.actividadId);
            return (
              <div key={r.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
                <div>
                  <Link href={`/actividad/${r.actividadId}`} className="font-semibold text-caribe-700 hover:underline">
                    {act?.nombre || "Actividad"}
                  </Link>
                  <p className="text-sm text-slate-500 mt-1">👧 {r.nombreNino}</p>
                  <p className="text-xs text-slate-400">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    r.estado === "ACTIVA" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {r.estado === "ACTIVA" ? "Activa" : "Cancelada"}
                  </span>
                  {r.estado === "ACTIVA" && (
                    <button
                      onClick={() => cancelar(r.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
